---
'@backstage/plugin-devtools-backend': patch
---

The Info tab now reads the package versions from `pnpm-lock.yaml` in pnpm projects, and lists the packages of the workspace with the versions in their `package.json` files. For a Backstage installation in a subdirectory of a pnpm workspace, the `backstage.json` version is read from the nearest `backstage.json` file from the installation up to the root of the workspace.
