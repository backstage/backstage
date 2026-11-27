# search-backend-module-elasticsearch

This is an extension module to the search-backend-node plugin, which provides basic types, interfaces and functionality to implement the search process within Backstage.

This module provides functionality to index and query documents using the Elasticsearch engine. It exposes configuration options to connect Backstage to your Elasticsearch cluster to be used as the search engine.

The `opensearch` and `aws` providers remain available for backwards
compatibility, but OpenSearch is now provided by the dedicated
`@backstage/plugin-search-backend-module-opensearch` package. See the
[Search Engines documentation](https://backstage.io/docs/features/search/search-engines#opensearch)
for migration details.

## Getting started

See [Backstage documentation](https://backstage.io/docs/features/search/search-engines#elasticsearch) for details on how to install and configure Elasticsearch for your Backstage instance.
