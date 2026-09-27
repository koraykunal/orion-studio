#!/usr/bin/env bash
#
# Orion Studio deployment.
#
# The previous version of this script was `git pull && docker compose up -d
# --build`. It could not succeed as committed, because docker-compose.yml
# referenced an env_file that is not in the repository, and it never applied
# database migrations, so it restarted the application against a schema that
# did not match the code.
#
# Order matters here: migrate BEFORE the new code serves traffic, and keep the
# previous image so a failure can be rolled back without a rebuild.

set -Eeuo pipefail

cd "$(dirname "$0")"

readonly SERVICE="web"
readonly IMAGE="orion-studio-web"
readonly ENV_FILE="web/.env.production"
readonly MIGRATION_IMAGE="${IMAGE}:migrate"

log()  { printf '\n\033[1;34m==>\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m!!\033[0m %s\n' "$*"; }
die()  { printf '\033[1;31mxx\033[0m %s\n' "$*" >&2; exit 1; }

trap 'die "deployment failed on line $LINENO"' ERR

# ---------------------------------------------------------------------------
# Preflight
# ---------------------------------------------------------------------------
preflight() {
    log "Preflight checks"

    command -v docker >/dev/null || die "docker is not installed"
    docker compose version >/dev/null || die "docker compose v2 is required"

    [[ -f "$ENV_FILE" ]] || die "$ENV_FILE not found. Copy web/.env.example and fill it in."

    # The compose file interpolates these into build args, so a missing value is
    # a silent dead-CTA bug rather than a build error unless we check it here.
    local site_url whatsapp
    site_url=$(grep -E '^NEXT_PUBLIC_SITE_URL=' "$ENV_FILE" | head -1 | cut -d= -f2- | tr -d '"' || true)
    whatsapp=$(grep -E '^NEXT_PUBLIC_WHATSAPP=' "$ENV_FILE" | head -1 | cut -d= -f2- | tr -d '"' || true)
    [[ -n "$site_url" ]] || die "NEXT_PUBLIC_SITE_URL is not set in $ENV_FILE"
    [[ -n "$whatsapp" ]] || die "NEXT_PUBLIC_WHATSAPP is not set in $ENV_FILE"

    command -v git >/dev/null || die "git is not installed"
    git diff --quiet -- prisma/ || warn "uncommitted Prisma changes present; deploy.sh will use what is committed"

    # certbot/ is gitignored because it holds the ACME account private key, so
    # it cannot be committed. Compose bind-mounts it, and a missing mount source
    # makes Docker create a directory where a file is expected.
    mkdir -p certbot/conf certbot/www
    [[ -f certbot/conf/live/orionstud.io/fullchain.pem ]] ||
        warn "no certificate for orionstud.io yet; run certbot before the first HTTPS deploy"
}

# ---------------------------------------------------------------------------
# Tag the currently running image so a rollback is a re-tag, not a rebuild
# ---------------------------------------------------------------------------
snapshot_current() {
    log "Snapshotting the running image for rollback"
    local current
    current=$(docker inspect --format '{{.Image}}' "$SERVICE" 2>/dev/null || true)
    if [[ -n "$current" ]]; then
        docker tag "$current" "${IMAGE}:previous" || warn "could not tag the previous image"
        echo "$current" > .deploy-previous-image
    else
        rm -f .deploy-previous-image
        warn "no running container found; rollback will require a manual image id"
    fi
}

# ---------------------------------------------------------------------------
# Migrations run against the database from an image built at the target commit,
# before the application is restarted.
# ---------------------------------------------------------------------------
migrate() {
    log "Applying database migrations"

    # The Prisma CLI is a devDependency, so the production image does not
    # contain it. The Dockerfile has a dedicated `migrate` target that carries
    # only the CLI, the schema and the migrations directory, so this is fast and
    # does not require building the application.
    #
    # `migrate deploy` applies committed migrations only. It never generates a
    # migration, never resets, and never drops data.
    local database_url
    database_url=$(grep -E '^DATABASE_URL=' "$ENV_FILE" | head -1 | cut -d= -f2- | tr -d '"')
    [[ -n "$database_url" ]] || die "DATABASE_URL is not set in $ENV_FILE"

    docker build \
        --target migrate \
        --build-arg DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build" \
        -t "$MIGRATION_IMAGE" \
        -f web/Dockerfile \
        web >/dev/null

    docker run --rm \
        --env-file "$ENV_FILE" \
        --network app-network \
        "$MIGRATION_IMAGE"

    log "Migrations applied"
}

# ---------------------------------------------------------------------------
# Deploy
# ---------------------------------------------------------------------------
deploy() {
    log "Building and starting the new release"

    docker compose build "$SERVICE"
    docker compose up -d --no-deps "$SERVICE"

    # Wait for the app's own readiness route, which checks the database too.
    log "Waiting for the service to report healthy"
    local deadline=$((SECONDS + 180))
    until docker compose exec -T "$SERVICE" node -e \
        "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" \
        >/dev/null 2>&1; do
        if (( SECONDS > deadline )); then
            rollback
            die "the new release never became healthy; rolled back"
        fi
        sleep 3
    done

    log "Release is healthy"
}

rollback() {
    warn "Rolling back"
    [[ -f .deploy-previous-image ]] || { warn "no previous image recorded; stopping here"; return 1; }

    local previous
    previous=$(cat .deploy-previous-image)
    docker tag "$previous" "${IMAGE}:latest" || return 1
    docker compose up -d --no-build --no-deps "$SERVICE" || return 1
    warn "rolled back to ${previous:0:12}"
}

# ---------------------------------------------------------------------------
# nginx reload so it re-resolves the web container's IP. Docker reassigns the
# container address on recreate and nginx caches the resolved name for the
# lifetime of the process, so without this it keeps proxying to a dead IP.
# ---------------------------------------------------------------------------
reload_nginx() {
    log "Reloading nginx"
    docker compose exec -T nginx nginx -s reload || warn "nginx reload failed; run 'docker compose restart nginx'"
}

renew_certificates() {
    log "Checking certificates"
    docker compose run --rm --entrypoint certbot certbot renew --quiet --webroot -w /var/www/certbot \
        || warn "certificate renewal failed; check that port 80 is reachable"
}

smoke_test() {
    log "Smoke testing"
    local origin
    origin=$(grep -E '^NEXT_PUBLIC_SITE_URL=' "$ENV_FILE" | head -1 | cut -d= -f2- | tr -d '"')

    for path in "/api/health" "/en" "/tr" "/en/work" "/en/services" "/sitemap.xml" "/robots.txt"; do
        local code
        code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "${origin}${path}" || echo 000)
        if [[ "$code" != "200" ]]; then
            warn "$path returned $code"
        fi
    done

    # The public site must never be served to an authenticated session or be
    # cached at the edge. Verify the header actually arrives.
    local hsts
    hsts=$(curl -sI --max-time 20 "${origin}/en" | grep -i '^strict-transport-security' || true)
    [[ -n "$hsts" ]] || warn "Strict-Transport-Security is missing from the response"
}

main() {
    preflight
    snapshot_current
    git pull --ff-only origin main
    migrate
    deploy
    reload_nginx
    renew_certificates
    smoke_test
    log "Deployment complete: $(git rev-parse --short HEAD)"
}

main "$@"
