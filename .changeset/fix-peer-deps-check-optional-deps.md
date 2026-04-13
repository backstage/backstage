---
'@backstage/repo-tools': patch
---

Fixed the `peer-deps` command to only require peer dependencies that are actually referenced by each package, rather than requiring all tracked peer dependencies for every package with any React dependency.
