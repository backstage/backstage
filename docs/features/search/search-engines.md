---
id: search-engines
title: Search Engines
description: Choosing and configuring your search engine for Backstage
---

# Search Engines

Backstage supports 2 search engines by default, an in-memory engine called Lunr
and ElasticSearch. You can configure your own search engines by implementing the
provided interface as mentioned in the
[search backend documentation.](./getting-started.md#Backend)

Provided search engine implementations have their own way of constructing
queries, which may be something you want to modify. Alterations to the querying
logic of a search engine can be made by providing your own implementation of a
QueryTranslator interface. This modification can be done without touching
provided search engines by using the exposed setter to set the modified query
translator into the instance.

```
const searchEngine = new LunrSearchEngine({ logger });
searchEngine.setTranslator(new MyNewAndBetterQueryTranslator());
```

## Lunr

Lunr search engine is enabled by default for your backstage instance if you have
not done additional changes to the scaffolded app.

Lunr can be instantiated like this:

```typescript
// app/backend/src/plugins/search.ts
const searchEngine = new LunrSearchEngine({ logger });
const indexBuilder = new IndexBuilder({ logger, searchEngine });
```

## ElasticSearch

Backstage supports ElasticSearch search engine connections, indexing and
querying out of the box. Available configuration options enable usage of either
AWS or Elastic.co hosted solutions, or a custom self-hosted solution.

Similarly to Lunr above, ElasticSearch can be set up like this:

```typescript
// app/backend/src/plugins/search.ts
const searchEngine = await ElasticSearchSearchEngine.initialize({
  logger,
  config,
});
const indexBuilder = new IndexBuilder({ logger, searchEngine });
```

For the engine to be available, your backend package needs a dependency into
package `@backstage/plugin-search-backend-module-elasticsearch`.

ElasticSearch needs some additional configuration before it is ready to use
within your instance. The configuration options are documented in the
[configuration schema definition file.](https://github.com/backstage/backstage/blob/master/plugins/search-backend-module-elasticsearch/config.d.ts)

The underlying functionality is using official ElasticSearch client version 7.x,
meaning that ElasticSearch version 7 is the only one confirmed to be supported.

## Example configurations

### AWS

Using AWS hosted ElasticSearch the only configuration option needed is the URL
to the ElasticSearch service. The implementation assumes that environment
variables for AWS access key id and secret access key are defined in accordance
to the
[default AWS credential chain.](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html).

```yaml
search:
  elasticsearch:
    provider: aws
    node: https://my-backstage-search-asdfqwerty.eu-west-1.es.amazonaws.com
```

### Elastic.co

Elastic Cloud hosted ElasticSearch uses a Cloud ID to determine the instance of
hosted ElasticSearch to connect to. Additionally, username and password needs to
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

### Others

Other ElasticSearch instances can be connected to by using standard
ElasticSearch authentication methods and exposed URL, provided that the cluster
supports that. The configuration options needed are the URL to the node and
authentication information. Authentication can be handled by either providing
username/password or an API key or a bearer token. In case both
username/password combination and one of the tokens are provided, token takes
precedence. For more information how to create an API key, see
[Elastic documentation on API keys](https://www.elastic.co/guide/en/elasticsearch/reference/current/security-api-create-api-key.html),
and how to create a bearer token see
[Elastic documentation on tokens.](https://www.elastic.co/guide/en/elasticsearch/reference/current/security-api-create-service-token.html)

#### Configuration examples

##### With username and password

```yaml
search:
  elasticsearch:
    node: http://localhost:9200
    auth:
      username: elastic
      password: changeme
```

##### With bearer token

```yaml
search:
  elasticsearch:
    node: http://localhost:9200
    auth:
      bearer: token
```

##### With API key

```yaml
search:
  elasticsearch:
    node: http://localhost:9200
    auth:
      apiKey: base64EncodedKey
```
