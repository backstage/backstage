---
'@backstage/config-loader': patch
---

When no root directory is given, the default configuration sources now read the configuration files from the root of the Backstage installation rather than the root of the workspace. The two differ in a pnpm workspace with the Backstage installation in a subdirectory. In a Yarn workspace both are the same directory, so nothing changes.
