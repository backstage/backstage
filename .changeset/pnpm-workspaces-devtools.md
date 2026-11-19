---
'@backstage/plugin-devtools-backend': patch
---

The Info tab now reads the package versions from `pnpm-lock.yaml` in pnpm projects, and lists the packages of the workspace with the versions in their `package.json` files. For a Backstage installation in a subdirectory of a pnpm workspace, the `backstage.json` version is read from the nearest `backstage.json` file from the installation up to the root of the workspace. The Config tab now reads the configuration schema of each workspace package from the directory of the package, so that it also hides the secrets that those packages declare in pnpm workspaces, where the packages may not be resolvable by name.
