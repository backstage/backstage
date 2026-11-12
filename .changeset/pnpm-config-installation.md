---
'@backstage/config-loader': patch
---

In a pnpm workspace with the Backstage installation in a subdirectory, the default configuration sources read the configuration files from the installation rather than from the root of the workspace.
