---
'@backstage/plugin-search-backend-module-elasticsearch': patch
---

Fixed inefficient bulk refresh behavior where `refreshOnCompletion: true` caused a full cluster refresh of all indexes instead of refreshing only the specific index being populated.

When using the Elasticsearch/OpenSearch bulk helper, passing `refreshOnCompletion: true` triggers a refresh of `_all` indexes. This change restores the original behavior of passing the specific index name, ensuring only the target index is refreshed after bulk indexing completes.

This fix improves performance for OpenSearch/Elasticsearch deployments, especially in multi-tenant environments or clusters with many indexes.
