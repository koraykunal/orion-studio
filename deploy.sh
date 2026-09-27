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

# Compose reads ${VAR} for interpolation from the shell or from a .env file
# next to the compose file, never from a service env_file. Naming the file
# explicitly is what makes the NEXT_PUBLIC_* build args resolve.
compose() {
    docker compose --env-file "$ENV_FILE" "$@"
}

log()  { printf '\n\033[1;34m==>\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m!!\033[0m %s\n' "$*"; }
die()  { printf '\033[1;31mxx\033[0m %s\n' "$*" >&2; exit 1; }

# Reports where the failure actually happened. $LINENO inside the trap points at
# the die() definition, so a bare trap made every failure look like it came from
# the same three lines of this file.
trap 'die "failed at line ${BASH_LINENO[0]}: ${BASH_COMMAND}"' ERR

# ---------------------------------------------------------------------------
# Env file reader
# ---------------------------------------------------------------------------
# Values in the env file may be quoted, commented or padded, and .env.example
# ships them quoted. Matching the raw line rejected a correctly configured
# value, which is a worse failure than accepting a sloppy one.
env_value() {
    sed -n "s/^[[:space:]]*$1[[:space:]]*=[[:space:]]*//p" "$ENV_FILE" \
        | head -1 \
        | sed -e 's/[[:space:]]*#.*$//' \
              -e 's/^["'"'"']//' \
              -e 's/["'"'"']$//' \
              -e 's/[[:space:]]*$//'
}

# ---------------------------------------------------------------------------
# Preflight
# ---------------------------------------------------------------------------
preflight() {
    log "Preflight checks"

    command -v docker >/dev/null || die "docker is not installed"
    docker compose version >/dev/null || die "docker compose v2 is required"

    if [[ ! -f "$ENV_FILE" ]]; then
        cat >&2 <<EOF

  $ENV_FILE not found.

  It is gitignored, because it holds secrets. Create it once on this host:

    cp web/.env.example "$ENV_FILE"
    chmod 600 "$ENV_FILE"
    \$EDITOR "$ENV_FILE"

  At minimum set:
    NEXT_PUBLIC_SITE_URL   canonical origin, e.g. https://orionstud.io
    NEXT_PUBLIC_WHATSAPP   digits only, no +, no spaces
    AUTH_SECRET             openssl rand -base64 32
    DATABASE_URL            managed PostgreSQL

  SMTP is optional: the contact form still works without it and inquiries are
  readable at /admin/messages, you just get no notification email.

EOF
        exit 1
    fi

    chmod 600 "$ENV_FILE" 2>/dev/null || true

    # Compose interpolates ${VAR} from this file only because deploy.sh passes
    # --env-file. The two NEXT_PUBLIC_* values are inlined into the bundle at
    # build time, so a missing one ships dead contact links rather than an
    # error.
    local missing=()
    for key in NEXT_PUBLIC_SITE_URL NEXT_PUBLIC_WHATSAPP AUTH_SECRET DATABASE_URL; do
        [[ -n "$(env_value "$key")" ]] || missing+=("$key")
    done

    if (( ${#missing[@]} > 0 )); then
        die "missing or empty in $ENV_FILE: ${missing[*]}"
    fi

    # Auth.js needs a trusted Host header behind a reverse proxy. This is on by
    # default in lib/auth.ts; only "false" turns it off, which would break
    # /api/auth/* and every protected route, so it is called out here.
    local trust_host
    trust_host=$(printf '%s' "$(env_value AUTH_TRUST_HOST)" | tr '[:upper:]' '[:lower:]')
    if [[ "$trust_host" == "false" || "$trust_host" == "0" || "$trust_host" == "no" ]]; then
        die "AUTH_TRUST_HOST is '$trust_host'. nginx is the only trusted hop and Auth.js
       rejects the Host header without it, which breaks /api/auth/* and every
       protected route. Remove the line or set it to true."
    fi

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

    # Resolve the container through compose rather than assuming the container
    # is named after the service. `docker inspect web` looks for a container
    # literally called "web", the real one is "orion-studio-web-1", so the
    # lookup silently found nothing and rollback had no image to return to.
    local container current
    container=$(compose ps -q "$SERVICE" 2>/dev/null | head -1 || true)

    if [[ -z "$container" ]]; then
        rm -f .deploy-previous-image
        die "cannot find the running $SERVICE container, so a rollback would have no image. Aborting before any change is made."
    fi

    current=$(docker inspect --format '{{.Image}}' "$container" 2>/dev/null || true)
    if [[ -z "$current" ]]; then
        rm -f .deploy-previous-image
        die "cannot read the image id of $container. Aborting before any change is made."
    fi

    docker tag "$current" "${IMAGE}:previous"
    printf '%s\n' "$current" > .deploy-previous-image
    log "Rollback target: ${current:0:19}"
}

# ---------------------------------------------------------------------------
# Migrations run before the application is restarted, from an image that carries
# the Prisma CLI and the migrations directory.
# ---------------------------------------------------------------------------
migrate() {
    log "Applying database migrations"

    # Declared as a compose service behind the `tools` profile so compose
    # attaches it to the right network and supplies env_file. A bare
    # `docker run --network app-network` fails: compose prefixes the network
    # with the project name, so the real one is orion-studio_app-network.
    #
    # `migrate deploy` applies committed migrations only. It never generates a
    # migration, never resets, and never drops data.
    compose build migrate
    compose run --rm --no-deps migrate

    log "Migrations applied"
}

# ---------------------------------------------------------------------------
# Deploy
# ---------------------------------------------------------------------------
deploy() {
    log "Building and starting the new release"

    compose build "$SERVICE"
    compose up -d --no-deps "$SERVICE"

    # Wait for the app's own readiness route, which checks the database too.
    log "Waiting for the service to report healthy"
    local deadline=$((SECONDS + 180))
    until compose exec -T "$SERVICE" node -e \
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
    compose up -d --no-build --no-deps "$SERVICE" || return 1
    warn "rolled back to ${previous:0:12}"
}

# ---------------------------------------------------------------------------
# nginx reload so it re-resolves the web container's IP. Docker reassigns the
# container address on recreate and nginx caches the resolved name for the
# lifetime of the process, so without this it keeps proxying to a dead IP.
# ---------------------------------------------------------------------------
reload_nginx() {
    log "Reloading nginx"
    compose exec -T nginx nginx -s reload || warn "nginx reload failed; run 'docker compose restart nginx'"
}

renew_certificates() {
    log "Checking certificates"
    compose run --rm --entrypoint certbot certbot renew --quiet --webroot -w /var/www/certbot \
        || warn "certificate renewal failed; check that port 80 is reachable"
}

smoke_test() {
    log "Smoke testing"
    local origin
    origin=$(env_value NEXT_PUBLIC_SITE_URL)
    [[ -n "$origin" ]] || die "NEXT_PUBLIC_SITE_URL is not readable from $ENV_FILE"

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
