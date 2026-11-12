---
'@backstage/config-loader': patch
---

When no root directory is given, the default configuration sources now read the configuration files from the root of the Backstage installation rather than the root of the workspace, as groundwork for pnpm support. In a Yarn workspace both are the same directory, so nothing changes.
