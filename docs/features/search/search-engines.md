---
id: search-engines
title: Search Engines
description: Choosing and configuring your search engine for Backstage
---

Backstage supports 3 search engines by default, an in-memory engine called [Lunr](#lunr), [Postgres](#postgres)
and [Elasticsearch](#elasticsearch).

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

:::note Note

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

Backstage supports Elasticsearch (and OpenSearch) search engine connections,
indexing and querying out of the box. Available configuration options enable
usage of either AWS or Elastic.co hosted solutions, or a custom self-hosted solution.

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

The underlying functionality uses either the official Elasticsearch client
version 7.x (meaning that Elasticsearch version 7 is the only one confirmed to
be supported), or the OpenSearch client, when the `aws` or `opensearch` provider
is configured.

### Example configurations

#### AWS

Using AWS hosted Elasticsearch the only configuration option needed is the URL
to the Elasticsearch service. The implementation assumes that environment
variables for AWS access key id and secret access key are defined in accordance
to the
[default AWS credential chain.](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html).

```yaml
search:
  elasticsearch:
    provider: aws
    node: https://my-backstage-search-asdfqwerty.eu-west-1.es.amazonaws.com
```

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

#### OpenSearch

OpenSearch can be self hosted for example with the [official docker image](https://hub.docker.com/r/opensearchproject/opensearch). The configuration requires only the node and authentication.

```yaml
search:
  elasticsearch:
    provider: opensearch
    node: http://0.0.0.0:9200
    auth:
      username: opensearch
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

### Search Result Scoring

Elasticsearch search results can be enhanced with configurable scoring to improve relevance. Scoring is opt-in and disabled by default; the legacy search behavior is preserved when scoring is not enabled. This feature is specific to the Elasticsearch search engine — adopters using the Postgres or in-memory engines will not see ranking changes from this configuration.

When enabled, the scoring path:

- Applies per-field boosts (e.g. `title`, `description`) so important fields rank higher.
- Provides per-document-type scoring profiles so different content types can use different field weights in the same query.
- Boosts exact and phrase matches over fuzzy matches.
- Preserves recall by including a catch-all match against all fields, so documents that don't have any of the configured weighted fields still surface in results — scoring only re-ranks the matches.

Fuzzy matching mechanics (the Levenshtein distance and prefix length) are controlled by `search.elasticsearch.queryOptions` (see above). When scoring is enabled, the `best_fields` query in the scoring path uses `queryOptions.fuzziness` (defaulting to `AUTO`) and `queryOptions.prefixLength` (defaulting to `0`).

#### Enabling scoring

```yaml
search:
  elasticsearch:
    scoring:
      enabled: true
```

#### Default field weights

When scoring is enabled, `defaultFieldWeights` provide baseline weights for document types without a specific profile:

- `title` fields: 10x weight
- `text` fields: 5x weight
- `description` fields: 3x weight
- `content` fields: 1x weight

The defaults cover the field names indexed by Backstage's bundled catalog and techdocs collators (`title` and `text`), plus `description` and `content` for collators that follow those conventions. If your collators use different field names (for example `name`, `displayName`, or `entityTitle`), override `defaultFieldWeights` to include them.

Additionally, exact phrase matches receive a 2x boost, plain phrase matches a 1.5x boost, and the fuzzy/best-fields query is weighted at 0.8x.

You can override these baselines:

```yaml
search:
  elasticsearch:
    scoring:
      enabled: true
      defaultFieldWeights:
        title: 15
        name: 10
        description: 5
        content: 1
```

> **Field name contract:** The default weights only take effect on fields that your collators actually index. If a collator (yours or one shipped by another plugin) uses different field names — or changes its schema in a future version — scoring for documents from that collator will silently fall back to the recall catch-all and rank by full-text match alone. Override `defaultFieldWeights` or add a `documentTypeProfiles` entry to compensate when you notice this.

#### Document type profiles

Different document types can have their own scoring profiles. No profiles are configured by default — when a document type has no profile, it is scored against `defaultFieldWeights`. The example below is a recommended starting point covering common Backstage plugins; adjust or extend it to match the document types you have indexed and the field schemas your collators produce.

```yaml
search:
  elasticsearch:
    scoring:
      enabled: true
      documentTypeProfiles:
        software-catalog:
          title: 15
          text: 5
          kind: 3
          componentType: 2
          type: 2
          owner: 2
          lifecycle: 1
        techdocs:
          title: 20
          entityTitle: 15
          text: 1
          owner: 2
          lifecycle: 1
        tools:
          title: 15
          text: 3
        stack-overflow:
          title: 15
          text: 3
          tags: 5
          answers: 2
```

When users search across all document types, each configured profile is applied as its own scoring branch, scoped to that document type's index. When a search is filtered to a single document type, that document type profile is used directly. When filtered to multiple document types, one scoring branch per requested type is generated so each type keeps its own field weights. Document types without a profile fall back to `defaultFieldWeights`.

#### Match type boosts

Configure how different match types are scored:

```yaml
search:
  elasticsearch:
    scoring:
      enabled: true
      matchBoosts:
        exact: 2.0
        phrase: 1.5
        fuzzy: 0.8
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

:::note Note

Custom authentication is supported for the `elastic`, `opensearch`, and default providers. The `aws` provider uses AWS SigV4 request signing and does not support custom auth providers.

:::
