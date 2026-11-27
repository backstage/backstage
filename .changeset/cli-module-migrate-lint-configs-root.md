---
'@backstage/cli-module-migrate': patch
---

The `migrate package-lint-configs` command now looks up the legacy ESLint configs in the project's own `@backstage/cli`, so it no longer fails when the package manager doesn't hoist `@backstage/cli`, such as with pnpm.
