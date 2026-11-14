---
'@backstage/repo-tools': patch
---

`package-docs` no longer fails outside the Backstage repository, and OpenAPI server generation skips Prettier when it isn't installed. The OpenAPI `diff` commands now find the specs at the base ref when the project is in a subdirectory of the git repository. Commands also find the root of a pnpm workspace. In a Backstage installation in a subdirectory of a larger workspace, they work on the packages and files of the installation, and find the tools that the package manager installed in a parent directory.
