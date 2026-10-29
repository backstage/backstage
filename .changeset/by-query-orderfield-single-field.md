---
'@backstage/plugin-catalog-backend': patch
'@backstage/catalog-client': patch
---

Documented that the `entities/by-query` endpoint currently applies only the first `orderField`; any additional order fields are ignored. Updated the OpenAPI spec parameter description and the Software Catalog API docs accordingly. No behavior change. Refs #17560.
