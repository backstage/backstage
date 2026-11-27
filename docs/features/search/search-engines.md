---
id: search-engines
title: Search Engines
description: Choosing and configuring your search engine for Backstage
---

Backstage supports 4 search engines by default, an in-memory engine called [Lunr](#lunr), [Postgres](#postgres),
[Elasticsearch](#elasticsearch) and [OpenSearch](#opensearch).

## Lunr

Lunr search engine is enabled by default for your Backstage instance if you have not done additional changes to the scaffolded app.

As Lunr is built into the Search backend plugin it can be added like this:

```bash title="From your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-search-backend
```

Then add the following line:

```ts title="packages/backend/src/index.ts"
const backend = createBackend();

// Other plugins...

/* highlight-add-start */
backend.add(import('@backstage/plugin-search-backend'));
/* highlight-add-end */

backend.start();
```

:::note

Lunr is appropriate as a zero-config search engine when developing
other parts of Backstage locally, however its use is highly discouraged when
running Backstage in production. When deploying Backstage, use one of the
other search engines instead.

:::

## Postgres

The Postgres based search engine only requires that Postgres being configured as
the database engine for Backstage. Therefore it targets setups that want to
avoid maintaining another external service like Elasticsearch. The search
provides decent results and performs well with ten thousands of indexed
documents. The connection to Postgres is established via the database manager
also used by other plugins.

> **Important**: The search plugin requires at least Postgres 12!

First we need to add the plugin:

```bash title="From your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-search-backend-module-pg
```

Then add the following line:

```ts title="packages/backend/src/index.ts"
const backend = createBackend();

// Other plugins...

// search plugin
backend.add(import('@backstage/plugin-search-backend'));

/* highlight-add-start */
backend.add(import('@backstage/plugin-search-backend-module-pg'));
/* highlight-add-end */

backend.start();
```

### Optional Configuration

The following is an example of the optional configuration that can be applied when using Postgres as the search backend. Currently this is mostly for just the highlight feature:

```yaml
search:
  pg:
    highlightOptions:
      useHighlight: true # Used to enable to disable the highlight feature. The default value is true
      maxWord: 35 # Used to set the longest headlines to output. The default value is 35.
      minWord: 15 # Used to set the shortest headlines to output. The default value is 15.
      shortWord: 3 # Words of this length or less will be dropped at the start and end of a headline, unless they are query terms. The default value of three (3) eliminates common English articles.
      highlightAll: false # If true the whole document will be used as the headline, ignoring the preceding three parameters. The default is false.
      maxFragments: 0 # Maximum number of text fragments to display. The default value of zero selects a non-fragment-based headline generation method. A value greater than zero selects fragment-based headline generation (see the linked documentation above for more details).
      fragmentDelimiter: ' ... ' # Delimiter string used to concatenate fragments. Defaults to " ... ".
```

**Note:** the highlight search term feature uses `ts_headline` which has been known to potentially impact performance. You only need this minimal config to disable it should you have issues:

```yaml
search:
  pg:
    highlightOptions:
      useHighlight: false
```

The Postgres documentation on [Highlighting Results](https://www.postgresql.org/docs/current/textsearch-controls.html#TEXTSEARCH-HEADLINE) has more details.

## Elasticsearch

Backstage supports Elasticsearch connections, indexing and querying out of the
box. Available configuration options enable usage of either Elastic.co hosted
solutions or a custom self-hosted solution. OpenSearch has its own module and
configuration; see [OpenSearch](#opensearch).

### Supported versions

| Search Engine | Supported Versions |
| ------------- | ------------------ |
| Elasticsearch | >= 8.19            |

:::note
Elasticsearch 7.x is no longer supported. See the [v1.55.0 release notes](../../releases/v1.55.0.md#breaking-elasticsearch-8-upgrade) for migration details.
:::

### Setup

Similarly to Postgres above, Elasticsearch can be set up as follows.

First we need to add the plugin:

```bash title="From your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-search-backend-module-elasticsearch
```

Then add the following line:

```ts title="packages/backend/src/index.ts"
const backend = createBackend();

// Other plugins...

// search plugin
backend.add(import('@backstage/plugin-search-backend'));

/* highlight-add-start */
backend.add(import('@backstage/plugin-search-backend-module-elasticsearch'));
/* highlight-add-end */

backend.start();
```

Elasticsearch needs some additional configuration before it is ready to use
within your instance. The configuration options are documented in the
[configuration schema definition file.](https://github.com/backstage/backstage/blob/master/plugins/search-backend-module-elasticsearch/config.d.ts)

:::note

The `opensearch` and `aws` providers previously configured under
`search.elasticsearch` are deprecated. They keep working during the migration
period, but new OpenSearch deployments should use the dedicated
[OpenSearch module](#opensearch) and `search.opensearch` configuration.

:::

### Example configurations

#### Elastic.co

Elastic Cloud hosted Elasticsearch uses a Cloud ID to determine the instance of
hosted Elasticsearch to connect to. Additionally, username and password needs to
be provided either directly or using environment variables like defined in
[Backstage documentation.](https://backstage.io/docs/conf/writing#includes-and-dynamic-data)

```yaml
search:
  elasticsearch:
    provider: elastic
    cloudId: backstage-elastic:asdfqwertyasdfqwertyasdfqwertyasdfqwerty==
    auth:
      username: elastic
      password: changeme
```

#### Others

Other Elasticsearch instances can be connected to by using standard
Elasticsearch authentication methods and exposed URL, provided that the cluster
supports that. The configuration options needed are the URL to the node and
authentication information. Authentication can be handled by either providing
username/password or an API key. For more information how to create an API key,
see
[Elastic documentation on API keys](https://www.elastic.co/guide/en/elasticsearch/reference/current/security-api-create-api-key.html).

##### With username and password

```yaml
search:
  elasticsearch:
    node: http://localhost:9200
    auth:
      username: elastic
      password: changeme
```

##### With API key

```yaml
search:
  elasticsearch:
    node: http://localhost:9200
    auth:
      apiKey: base64EncodedKey
```

### Elasticsearch batch size

Default batch size of the Elasticsearch engine is set to 1000. If you are using a lower spec computing resources (like AWS small instance),
you may get an error caused by limited `thread_pool` configuration. ( `429 Too Many Requests /_bulk` )

In this case you need to decrease the batch size to index the resources to prevent this kind of error. You can easily decrease
or increase the batch size in your `app-config.yaml` using the `batchSize` option provided for Elasticsearch configuration.

**Set batch size to 100**

```yaml
search:
  elasticsearch:
    batchSize: 100
```

> You can also increase the batch size if you are using a large ES instance.

### Elasticsearch batch key field

By default, during bulk uploads with the Elasticsearch indexer, each document is assigned an auto-generated `_id` unless a `batchKeyField` is explicitly set. This configuration is optional and most users won’t need to customize it. However, if your use case involves frequent lookups or updates to existing documents, setting `batchKeyField` can be beneficial. It allows you to define a consistent identifier for each document, helping to streamline updates and prevent duplicate entries. Be aware that if the value provided for `batchKeyField` is not unique across documents, Elasticsearch will overwrite any existing document with the same `_id`.

**Using `batchKeyField` (Custom `_id`)**

```yaml
search:
  elasticsearch:
    batchKeyField: document_id
```

**Default Behavior (Auto-generated `_id`)**

```yaml
search:
  elasticsearch:
    # No batchKeyField specified — Elasticsearch will autogenerate _id
```

### Elasticsearch Index Name Customization

By default, the Elasticsearch indexer creates index names based on their type, a separator, and the current date as a postfix. You can configure a custom prefix for all indices by adding the following section to your app configuration.

An example of a default index name would look like this:  
`software-catalog-index__20250219`

To prefix all indices with a custom string (e.g., `custom-prefix`), use the following configuration:

```yaml
search:
  elasticsearch:
    indexPrefix: custom-prefix-
```

After applying this setting, an index name would look like this: `custom-prefix-software-catalog-index__20250219`

### Elasticsearch index retention

Each indexing run writes documents to a fresh index and then moves the search
alias for that document type to it. To make sure searches that are already
running can finish, the indexer keeps the previous index around for one more
run:

- The current and previous index are retained per document type, so in-flight
  searches against the previous index can complete.
- The previous index is deleted after the next successful indexing run for that
  document type.
- Your cluster's storage and shard capacity should allow for two indices per
  document type between runs, and temporarily three while an indexing run is in
  progress.

### Elasticsearch query config

By default the default settings for the Elasticsearch queries is used. If you need to tweak the fuzziness of the query results you can do this with 2 parameters, `fuzziness` and `prefixLength`.

Fuzziness allows you to define the maximum Levenshtein distance, AUTO is the default and widely accepted standard.
`prefixLength` allows you to control the minimum number of characters that must match exactly at the beginning of the query term. This defaults to 0
[More info](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-fuzzy-query.html)

```yaml
search:
  elasticsearch:
    queryOptions:
      fuzziness: AUTO
      prefixLength: 3;
```

### Custom Authentication Extension Point

For enterprise environments that require dynamic authentication mechanisms such as bearer tokens with automatic rotation, the Elasticsearch module provides an authentication extension point. This is useful when:

- Using OAuth2/OIDC identity providers for service authentication
- Tokens need to be refreshed automatically (e.g., tokens that expire hourly)
- Integrating with internal identity services
- Running Elasticsearch/OpenSearch clusters secured by token-based authentication

To use custom authentication, create a backend module that provides an auth provider:

```ts title="packages/backend/src/modules/elasticsearchAuth.ts"
import { createBackendModule } from '@backstage/backend-plugin-api';
import { elasticsearchAuthExtensionPoint } from '@backstage/plugin-search-backend-module-elasticsearch';

export default createBackendModule({
  pluginId: 'search',
  moduleId: 'elasticsearch-custom-auth',
  register(env) {
    env.registerInit({
      deps: {
        elasticsearchAuth: elasticsearchAuthExtensionPoint,
      },
      async init({ elasticsearchAuth }) {
        elasticsearchAuth.setAuthProvider({
          async getAuthHeaders() {
            // Fetch token from your identity service
            const token = await myTokenService.getToken();
            return { Authorization: `Bearer ${token}` };
          },
        });
      },
    });
  },
});
```

Then register this module in your backend:

```ts title="packages/backend/src/index.ts"
const backend = createBackend();

// Other plugins...

backend.add(import('@backstage/plugin-search-backend'));
backend.add(import('@backstage/plugin-search-backend-module-elasticsearch'));

/* highlight-add-start */
backend.add(import('./modules/elasticsearchAuth'));
/* highlight-add-end */

backend.start();
```

The `getAuthHeaders` method is called before each request, allowing for just-in-time token retrieval and automatic rotation. When an auth provider is configured, it takes precedence over any static authentication in `app-config.yaml`.

:::note

Custom authentication is supported for the `elastic`, `opensearch`, and default providers. The `aws` provider uses AWS SigV4 request signing and does not support custom auth providers.

:::

## OpenSearch

The dedicated OpenSearch module connects Backstage to self-hosted OpenSearch
clusters and Amazon OpenSearch Service. It uses the
`@opensearch-project/opensearch` client and reads its configuration from
`search.opensearch`, independently of the Elasticsearch module.

### Supported versions

| Search Engine | Supported Versions |
| ------------- | ------------------ |
| OpenSearch    | 1.x, 2.x           |

:::note

OpenSearch 3.x has not been validated by this module or its test suite, so no
compatibility with 3.x is claimed. The module uses the OpenSearch client from
the same version line that is used by the Elasticsearch module.

:::

### Setup

Add the module to your backend:

```bash title="From your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-search-backend-module-opensearch
```

```ts title="packages/backend/src/index.ts"
const backend = createBackend();

// Other plugins...

// search plugin
backend.add(import('@backstage/plugin-search-backend'));

/* highlight-add-start */
backend.add(import('@backstage/plugin-search-backend-module-opensearch'));
/* highlight-add-end */

backend.start();
```

The available options are documented in the
[configuration schema definition file.](https://github.com/backstage/backstage/blob/master/plugins/search-backend-module-opensearch/config.d.ts)

### Basic configuration

For a self-hosted cluster, set the node URL and authentication. The `default`
provider is used when `provider` is omitted.

```yaml
search:
  opensearch:
    node: http://localhost:9200
    auth:
      username: opensearch
      password: changeme
```

An API key can be used instead of a username and password. It is sent as an
`ApiKey` authorization header.

```yaml
search:
  opensearch:
    node: http://localhost:9200
    auth:
      apiKey: base64EncodedKey
```

TLS verification can be adjusted for clusters with private certificate
authorities:

```yaml
search:
  opensearch:
    node: https://opensearch.internal:9200
    clientOptions:
      ssl:
        rejectUnauthorized: false
```

### Amazon OpenSearch Service

The `aws` provider signs requests using AWS Signature Version 4 (SigV4). It
uses the default Amazon Web Services credential chain, so no credentials are
stored in `app-config.yaml`.

```yaml
search:
  opensearch:
    provider: aws
    node: https://search-backstage-abc123.eu-west-1.es.amazonaws.com
```

For Amazon OpenSearch Serverless, set `service: aoss`. The `region` option is
only needed when it cannot be derived from the node URL.

```yaml
search:
  opensearch:
    provider: aws
    node: https://backstage.eu-west-1.aoss.amazonaws.com
    service: aoss
```

Custom authentication providers are not used by the `aws` provider because it
signs every request itself.

### Providers

The `default` and `aws` providers are built into the module. Set
`search.opensearch.provider` to select one. The value `opensearch` is accepted
as an alias for `default` to make migration from the Elasticsearch module
easier. Other managed OpenSearch services can be supported without changing
this module by registering a provider through
`opensearchProviderExtensionPoint`:

```ts title="packages/backend/src/modules/opensearchProvider.ts"
import { createBackendModule } from '@backstage/backend-plugin-api';
import { opensearchProviderExtensionPoint } from '@backstage/plugin-search-backend-module-opensearch';

export default createBackendModule({
  pluginId: 'search',
  moduleId: 'opensearch-managed-provider',
  register(env) {
    env.registerInit({
      deps: {
        opensearchProviders: opensearchProviderExtensionPoint,
      },
      async init({ opensearchProviders }) {
        opensearchProviders.addProvider({
          id: 'my-provider',
          async createClientOptions({ config }) {
            return {
              node: config.getString('node'),
              headers: { Authorization: await getToken() },
            };
          },
        });
      },
    });
  },
});
```

Select the provider with `search.opensearch.provider: my-provider` and register
the module in your backend. A provider can also replace a built-in id so that
connection or authentication behavior for `default` or `aws` can be
customized. Registering the same custom id twice is an error.

For tokens that rotate, `opensearchAuthExtensionPoint` supplies headers before
each request and takes precedence over static `auth` configuration:

```ts title="packages/backend/src/modules/opensearchAuth.ts"
import { createBackendModule } from '@backstage/backend-plugin-api';
import { opensearchAuthExtensionPoint } from '@backstage/plugin-search-backend-module-opensearch';

export default createBackendModule({
  pluginId: 'search',
  moduleId: 'opensearch-custom-auth',
  register(env) {
    env.registerInit({
      deps: {
        opensearchAuth: opensearchAuthExtensionPoint,
      },
      async init({ opensearchAuth }) {
        opensearchAuth.setAuthProvider({
          async getAuthHeaders() {
            const token = await myTokenService.getToken();
            return { Authorization: `Bearer ${token}` };
          },
        });
      },
    });
  },
});
```

### Indexing and query options

Batch size, batch key field, index prefix, highlighting and query fuzziness
follow the same semantics as the Elasticsearch engine.

```yaml
search:
  opensearch:
    node: http://localhost:9200
    batchSize: 100
    batchKeyField: document_id
    indexPrefix: custom-prefix-
    highlightOptions:
      fragmentSize: 1000
      numFragments: 1
      fragmentDelimiter: ' ... '
    queryOptions:
      fuzziness: AUTO
      prefixLength: 3
```

Each indexing run writes to a fresh index and moves the search alias to it.
The previous index is retained for one more run so that in-flight queries can
complete, and is deleted after the next successful run. Allow for two indices
per document type, and temporarily three while an indexing run is in progress.

### Migration from the Elasticsearch module

Existing OpenSearch configurations continue to work during the migration
period. When `search.elasticsearch.provider` is `opensearch` or `aws`, the
Elasticsearch module logs a single warning pointing to this module. No
removal version is announced here; follow future release notes for that.

To migrate, install and register the OpenSearch module, then move the
OpenSearch configuration under `search.opensearch`:

```yaml title="Before"
search:
  elasticsearch:
    provider: opensearch
    node: http://localhost:9200
    auth:
      username: opensearch
      password: changeme
```

```yaml title="After"
search:
  opensearch:
    node: http://localhost:9200
    auth:
      username: opensearch
      password: changeme
```

The same mapping applies to the AWS provider:

| Elasticsearch module setting                | OpenSearch module setting                          |
| ------------------------------------------- | -------------------------------------------------- |
| `search.elasticsearch.provider: opensearch` | `search.opensearch.provider: default` (or omit it) |
| `search.elasticsearch.provider: aws`        | `search.opensearch.provider: aws`                  |
| Other `search.elasticsearch.*` options      | Same key under `search.opensearch`                 |

Keep only the Elasticsearch module registered while using legacy
OpenSearch configuration. Once migrated, you can remove it if you no longer
need Elasticsearch. Registering both modules with configuration for both will
fail because the search backend accepts a single search engine.
