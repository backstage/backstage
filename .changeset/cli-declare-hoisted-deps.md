---
'@backstage/cli-module-build': patch
'@backstage/cli-module-maintenance': patch
'@backstage/cli-module-test-jest': patch
---

Added dependencies that these packages used without declaring them, so that they also work with package managers that don't hoist dependencies, such as pnpm: `esbuild` and `eslint` in `@backstage/cli-module-build`, `@typescript-eslint/parser` in `@backstage/cli-module-maintenance`, and `yaml` in `@backstage/cli-module-test-jest`.
