---
'@backstage/cli-common': patch
---

`targetPaths` finds the root of a pnpm workspace through its `pnpm-workspace.yaml` file. A directory with a `workspaces` field inside a pnpm workspace is the root of a Backstage installation when the `packages` patterns of the workspace include it or a directory inside it, and a workspace of its own otherwise. A Yarn project is always a workspace of its own.
