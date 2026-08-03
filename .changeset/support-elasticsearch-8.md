---
'@backstage/plugin-search-backend-module-elasticsearch': major
---

Upgraded the Elasticsearch client to version 8, requiring at least version 8.19 - the only 8.x release line still under support, [following the end of life of Elasticsearch 7.x and earlier 8.x lines](https://endoflife.date/elasticsearch).

If you use the `elastic` provider or connect to a plain Elasticsearch node, make sure your cluster is running Elasticsearch 8.19 or later before upgrading. The `aws` and `opensearch` providers keep using the OpenSearch client and are unaffected. Existing TLS settings continue to work without any configuration changes.
