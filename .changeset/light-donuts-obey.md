---
'@backstage/plugin-scaffolder-backend': patch
---

Added support for handling broken symlinks within the scaffolder backend. This is intended for templates that may hold a symlink that is invalid at build time but valid within the destination repo.
