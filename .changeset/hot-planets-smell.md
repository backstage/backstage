---
'@backstage/plugin-catalog-backend-module-github': patch
'@backstage/integration': patch
---

Introduces a new type of GitHub URL to reference catalog files `https://github.com/a/b/blob/release/production?path=path/to/c.yaml`, allowing backstage to distinguish between branch names like `release/production` (including `/`) from the catalog path. Fixes https://github.com/backstage/backstage/issues/16403
