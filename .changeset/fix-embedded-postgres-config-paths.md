---
'@backstage/cli-module-build': patch
---

Fixed config path resolution for the embedded-postgres database client detection to resolve paths relative to the target package directory rather than the workspace root.
