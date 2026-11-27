# search-backend-module-opensearch

This module adds OpenSearch as a search engine to the search backend. It uses
the `@opensearch-project/opensearch` client and reads its configuration from
`search.opensearch`.

## Installation

```bash
yarn --cwd packages/backend add @backstage/plugin-search-backend-module-opensearch
```

```ts title="packages/backend/src/index.ts"
const backend = createBackend();

backend.add(import('@backstage/plugin-search-backend'));
backend.add(import('@backstage/plugin-search-backend-module-opensearch'));

backend.start();
```

## Configuration

```yaml
search:
  opensearch:
    node: http://localhost:9200
    auth:
      username: opensearch
      password: changeme
```

The `default` provider supports basic authentication and API keys. The `aws`
provider signs requests with AWS SigV4. Custom connection and authentication
logic can be added with the `opensearchProviderExtensionPoint` extension point.

See the [Search Engines documentation](https://backstage.io/docs/features/search/search-engines#opensearch)
for all configuration options, provider details, supported versions and
migration instructions.
