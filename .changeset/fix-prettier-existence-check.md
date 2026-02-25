---
'@backstage/repo-tools': patch
---

Fixed prettier existence checks in OpenAPI commands to use `fs.pathExists` instead of checking the resolved path string, which was always truthy.
