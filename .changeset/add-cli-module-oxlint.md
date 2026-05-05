---
'@backstage/cli-module-oxlint': minor
---

Added a new CLI module that provides `package lint` and `repo lint` commands powered by oxlint, replacing ESLint as the default lint engine. Includes a `defineBackstageConfig` factory for generating role-aware oxlint configurations and seven ported Backstage-specific lint rules.
