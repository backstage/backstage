---
'@backstage/eslint-plugin': patch
---

The fix for `no-undeclared-imports` now uses pnpm to add and remove dependencies in pnpm workspaces, which it recognizes from the `packageManager` or `devEngines.packageManager` field of the root `package.json`, from `pnpm-lock.yaml`, or from `pnpm-workspace.yaml`, also for a Backstage installation in a subdirectory of a pnpm workspace. Workspace packages are added with a `workspace:^` range.
