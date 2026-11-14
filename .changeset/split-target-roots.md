---
'@backstage/cli-common': patch
---

`targetPaths` now has two roots. `workspaceRootDir` is the root of the package manager workspace, and `installationRootDir` is the root of the Backstage installation, which is the nearest directory with a `workspaces` field in its `package.json`. `targetPaths` finds the root of a pnpm workspace through its `pnpm-workspace.yaml` file. A directory with a `workspaces` field inside a pnpm workspace is the root of a Backstage installation when the `packages` patterns of the workspace include it or a directory inside it, and a workspace of its own otherwise. A Yarn project is always a workspace of its own, so in a Yarn workspace both roots are the workspace root. `backstageJsonPath` is the nearest `backstage.json` file from the installation root up to the workspace root, and `resolveWorkspaceRoot` and `resolveInstallationRoot` resolve paths relative to each root.

`rootDir` and `resolveRoot` are deprecated. They keep returning the workspace root, so switch to whichever of the two roots you need. `overrideTargetPaths` accepts `workspaceRootDir`, `installationRootDir`, and `backstageJsonPath` options.
