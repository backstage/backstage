---
'@backstage/repo-tools': patch
---

Commands now find the root of a pnpm workspace. In a Backstage installation in a subdirectory of a larger workspace, they work on the packages and files of the installation, and find the tools that the package manager installed in a parent directory.
