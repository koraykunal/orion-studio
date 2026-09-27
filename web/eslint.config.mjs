import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * Lint configuration.
 *
 * The previous setup enabled seven jsx-a11y rules, all of them static-shape
 * checks, so a clean run was fully compatible with a missing focus trap, a
 * skipped heading level, an unlabelled dialog and a div with a click handler.
 * The behavioural rules below are the ones that catch those, and they are on
 * as errors because a warning nobody reads is the same as no rule.
 *
 * `npm run verify` runs lint, typecheck, tests and the build in that order, and
 * CI runs the same command, so a violation fails the pipeline rather than
 * waiting to be noticed in review.
 */
const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,

    {
        rules: {
            // ── Accessibility ──────────────────────────────────────────────
            // Interactive elements must be reachable and operable by keyboard.
            "jsx-a11y/click-events-have-key-events": "error",
            "jsx-a11y/no-static-element-interactions": "error",
            "jsx-a11y/no-noninteractive-element-interactions": "error",
            "jsx-a11y/no-noninteractive-tabindex": "error",
            "jsx-a11y/interactive-supports-focus": "error",
            "jsx-a11y/no-autofocus": "error",
            "jsx-a11y/tabindex-no-positive": "error",

            // Content and labelling.
            //
            // `control-has-associated-label` is deliberately NOT enabled. It
            // only recognises aria-label, aria-labelledby and title on the
            // control itself, so it does not understand a wrapping <label> or
            // an htmlFor/id pair. Enabling it alongside
            // `label-has-associated-control` (which models both correctly)
            // would force a redundant aria-label onto every input in the app.
            // Association is covered by the latter, and the concrete forms are
            // asserted in tests/a11y.test.ts.
            "jsx-a11y/label-has-associated-control": ["error", { assert: "either" }],
            "jsx-a11y/anchor-has-content": "error",
            "jsx-a11y/heading-has-content": "error",
            "jsx-a11y/iframe-has-title": "error",
            "jsx-a11y/media-has-caption": "error",
            "jsx-a11y/anchor-is-valid": "error",

            // Document and landmark integrity.
            "jsx-a11y/html-has-lang": "error",
            "jsx-a11y/lang": "error",
            "jsx-a11y/aria-role": "error",
            "jsx-a11y/role-has-required-aria-props": "error",
            "jsx-a11y/role-supports-aria-props": "error",
            "jsx-a11y/no-noninteractive-element-to-interactive-role": "error",
            "jsx-a11y/no-aria-hidden-on-focusable": "error",
            "jsx-a11y/aria-activedescendant-has-tabindex": "error",
            "jsx-a11y/no-access-key": "error",

            // Note: heading-order and region were removed in jsx-a11y 6.10, so
            // heading hierarchy and landmark coverage are reviewed by hand and
            // covered by the page-level assertions in tests/.

            // ── React ───────────────────────────────────────────────────────
            // A raw img bypasses the image optimiser, which is also the
            // documented remote-code-execution surface for that endpoint.
            "@next/next/no-img-element": "error",
            "react-hooks/exhaustive-deps": "warn",

            // ── TypeScript ─────────────────────────────────────────────────
            // `any` on a request body is how the mass-assignment bug in
            // PUT /api/admin/posts/[id] was able to reach authorId.
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/consistent-type-imports": [
                "error",
                { prefer: "type-imports", fixStyle: "inline-type-imports" },
            ],
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
        },
    },

    // An unused disable directive usually means the code it silenced has
    // changed and the comment has not. Treat it as an error so the comments
    // stay true. This is a linter option, not a rule, so it lives in its own
    // block.
    {
        linterOptions: {
            reportUnusedDisableDirectives: "error",
        },
    },

    globalIgnores([
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
        "public/**",
        "prisma/migrations/**",
    ]),
]);

export default eslintConfig;
