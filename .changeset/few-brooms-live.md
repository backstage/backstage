---
'@backstage/cli': patch
---

Added oxlint as an alternative lint engine for package and repo lint commands. Packages can opt in by passing `--engine oxlint` to `backstage-cli package lint`, which uses a shared configuration with custom JS plugins that port Backstage-specific ESLint rules. Both `oxlint` and `oxlint-tsgolint` are added as optional peer dependencies.
