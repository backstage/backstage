---
'@backstage/plugin-catalog-backend-module-backstage-openapi': patch
'@backstage/plugin-search-backend-module-catalog': patch
'@backstage/plugin-kubernetes-backend': patch
---

Fix issue where `backstage-cli config:check --strict` would complain about open-ended configuration fields having additional properties.
