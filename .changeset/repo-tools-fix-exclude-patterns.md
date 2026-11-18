---
'@backstage/repo-tools': patch
---

Fixed `--exclude` package filtering so passing multiple exclude patterns (for example comma-separated or repeated `--exclude` flags in `api-reports`) excludes packages matching any of the patterns instead of none.
