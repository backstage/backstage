---
'@backstage/cli': patch
---

Added a new ESLint configuration setup for packages, which utilizes package roles to generate the correct configuration. The new configuration is available at `@backstage/cli/config/eslint-factory`.

Introduced a new `backstage-cli migrate package-lint-configs` command, which migrates old lint configurations to use `@backstage/cli/config/eslint-factory`.
