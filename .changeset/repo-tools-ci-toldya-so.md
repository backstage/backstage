---
'@backstage/repo-tools': patch
---

Added a `--ci` flag to the `generate-catalog-info` command. This flag behaves similarly to the same flag on `api-reports`: if `catalog-info.yaml` files would have been added or modified, then the process exits with status code `1`, and instructions are printed.
