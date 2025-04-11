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
    queryConfig:
      fuzziness: AUTO
      prefixLength: 3;
```
