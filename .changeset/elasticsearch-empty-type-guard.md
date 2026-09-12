---
'@backstage/plugin-search-backend-module-elasticsearch': patch
---

Fixed a bug where an empty document type list could result in querying all indices instead of returning empty results.
