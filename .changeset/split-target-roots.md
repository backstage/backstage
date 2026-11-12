---
'@backstage/cli-common': patch
---

`targetPaths` now has two roots, as groundwork for pnpm support. `workspaceRootDir` is the root of the package manager workspace, and `installationRootDir` is the root of the Backstage installation, which is the nearest directory with a `workspaces` field in its `package.json`. In a Yarn workspace both are the workspace root. `backstageJsonPath` is the nearest `backstage.json` file from the installation root up to the workspace root, and `resolveWorkspaceRoot` and `resolveInstallationRoot` resolve paths relative to each root.

`rootDir` and `resolveRoot` are deprecated. They keep returning the workspace root, so switch to whichever of the two roots you need. `overrideTargetPaths` accepts `workspaceRootDir`, `installationRootDir`, and `backstageJsonPath` options.
