---
'@backstage/cli-common': patch
---

`targetPaths` now distinguishes two roots. `workspaceRootDir` is the root of the package manager workspace, found through a `workspaces` field in `package.json` or, new in this release, a `pnpm-workspace.yaml` file. A directory with a `workspaces` field belongs to a pnpm workspace above it when the `packages` patterns in `pnpm-workspace.yaml` include the directory or a directory inside it, and is a workspace of its own otherwise. `installationRootDir` is the root of the Backstage installation, which is the nearest directory with a `package.json` that has a `workspaces` field within the workspace. In a Yarn workspace this is the workspace root. pnpm ignores the field, so in a pnpm workspace it marks a Backstage installation in a subdirectory, and without one the installation root is the workspace root. `backstageJsonPath` is the nearest `backstage.json` file from the installation root up to the workspace root, so several installations can share one. `resolveWorkspaceRoot` and `resolveInstallationRoot` resolve paths relative to each root.

`rootDir` and `resolveRoot` are deprecated. They keep returning the workspace root, so switch to whichever of the two roots you need. `overrideTargetPaths` accepts `workspaceRootDir`, `installationRootDir`, and `backstageJsonPath` options.
