---
'@backstage/cli': minor
---

**BREAKING**: The Jest configuration defined at `@backstage/cli/config/jest` no longer collects configuration defined in the `"jest"` field from all parent `package.json` files. Instead, it will only read and merge configuration from the `package.json` in the monorepo root if it exists, as well as the target package. In addition, configuration defined in the root `package.json` will now only be merged into each package configuration if it is a valid project-level configuration key.
