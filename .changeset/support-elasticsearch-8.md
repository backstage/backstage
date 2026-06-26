---
'@backstage/plugin-search-backend-module-elasticsearch': major
---

Upgraded the Elasticsearch client to version 8. Elasticsearch 8.x is now the confirmed supported version, following the end of life of Elasticsearch 7.x.

If you use the `elastic` provider or connect to a plain Elasticsearch node, make sure your cluster is running Elasticsearch 8.x before upgrading. The `aws` and `opensearch` providers keep using the OpenSearch client and are unaffected. Existing TLS settings continue to work without any configuration changes.
