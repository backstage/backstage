---
'@backstage/plugin-catalog-backend-module-github': patch
---

Catalog location URLs and refresh keys built by the GitHub entity provider now percent-encode the committed file paths and branch names, including the repository's default branch, that they are constructed from, and file paths or branch names that contain `.` or `..` segments are ignored.
