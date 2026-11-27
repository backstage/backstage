---
'@backstage/plugin-search-backend-module-elasticsearch': patch
---

Deprecated the `opensearch` and `aws` providers. They keep working and log a single migration warning pointing to the new `@backstage/plugin-search-backend-module-opensearch` package and the `search.opensearch` configuration. Elasticsearch-only configurations are unaffected.
