---
'@backstage/repo-tools': patch
---

Commands now also find the root of a pnpm workspace, which declares its packages in `pnpm-workspace.yaml` rather than in a `workspaces` field. In a Backstage installation in a subdirectory of a larger workspace, they work on the packages and files of the installation, and find the tools that the package manager installed in a parent directory. The OpenAPI `diff` commands now also find the specs at the base ref when the project is in a subdirectory of the git repository.
