# @backstage/plugin-search-backend-node

## 0.4.2

### Patch Changes

- a13f21cdc: Implement optional `pageCursor` based paging in search.

  To use paging in your app, add a `<SearchResultPager />` to your
  `SearchPage.tsx`.

- Updated dependencies
  - @backstage/search-common@0.2.0

## 0.4.1

### Patch Changes

- d9c13d535: Implements configuration and indexing functionality for ElasticSearch search engine. Adds indexing, searching and default translator for ElasticSearch and modifies default backend example-app to use ES if it is configured.

  ## Example configurations:

  ### AWS

  Using AWS hosted ElasticSearch the only configuration options needed is the URL to the ElasticSearch service. The implementation assumes
  that environment variables for AWS access key id and secret access key are defined in accordance to the [default AWS credential chain.](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html).

  ```yaml
  search:
    elasticsearch:
      provider: aws
      node: https://my-backstage-search-asdfqwerty.eu-west-1.es.amazonaws.com
  ```

  ### Elastic.co

  Elastic Cloud hosted ElasticSearch uses a Cloud ID to determine the instance of hosted ElasticSearch to connect to. Additionally, username and password needs to be provided either directly or using environment variables like defined in [Backstage documentation.](https://backstage.io/docs/conf/writing#includes-and-dynamic-data)

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

  Other ElasticSearch instances can be connected to by using standard ElasticSearch authentication methods and exposed URL, provided that the cluster supports that. The configuration options needed are the URL to the node and authentication information. Authentication can be handled by either providing username/password or and API key or a bearer token. In case both username/password combination and one of the tokens are provided, token takes precedence. For more information how to create an API key, see [Elastic documentation on API keys](https://www.elastic.co/guide/en/elasticsearch/reference/current/security-api-create-api-key.html) and how to create a bearer token, see [Elastic documentation on tokens.](https://www.elastic.co/guide/en/elasticsearch/reference/current/security-api-create-service-token.html)

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

- Updated dependencies
  - @backstage/search-common@0.1.3

## 0.4.0

### Minor Changes

- 97b2eb37b: Change return value of `SearchEngine.index` to `Promise<void>` to support
  implementation of external search engines.

## 0.3.0

### Minor Changes

- 9f3ecb555: Build search queries using the query builder in `LunrSearchEngine`. This removes
  the support for specifying custom queries with the lunr query syntax, but makes
  sure that inputs are properly escaped. Supporting the full lunr syntax is still
  possible by setting a custom query translator.
  The interface of `LunrSearchEngine.setTranslator()` is changed to support
  building lunr queries.

### Patch Changes

- 9f3ecb555: Enhance the search results of `LunrSearchEngine` to support a more natural
  search experience. This is done by allowing typos (by using fuzzy search) and
  supporting typeahead search (using wildcard queries to match incomplete words).
- 4176a60e5: Change search scheduler from starting indexing in a fixed interval (for example
  every 60 seconds), to wait a fixed time between index runs.
  This makes sure that no second index process for the same document type is
  started when the previous one is still running.

## 0.2.2

### Patch Changes

- 9c8ea7e24: Handle errors in collators and decorators and log them.
- 7e7cec86a: Fixed bug preventing searches with filter values containing `:` from returning results.

## 0.2.1

### Patch Changes

- 14aad6113: Improved the quality of free text searches in LunrSearchEngine.

## 0.2.0

### Minor Changes

- 5aff84759: This release represents a move out of a pre-alpha phase of the Backstage Search
  plugin, into an alpha phase. With this release, you gain more control over the
  layout of your search page on the frontend, as well as the ability to extend
  search on the backend to encompass everything Backstage users may want to find.

  If you are updating to version `v0.4.0` of `@backstage/plugin-search` from a
  prior release, you will need to make modifications to your app backend.

  First, navigate to your backend package and install the two related search
  backend packages:

  ```sh
  cd packages/backend
  yarn add @backstage/plugin-search-backend @backstage/plugin-search-backend-node
  ```

  Wire up these new packages into your app backend by first creating a new
  `search.ts` file at `src/plugins/search.ts` with contents like the following:

  ```typescript
  import { useHotCleanup } from '@backstage/backend-common';
  import { createRouter } from '@backstage/plugin-search-backend';
  import {
    IndexBuilder,
    LunrSearchEngine,
  } from '@backstage/plugin-search-backend-node';
  import { PluginEnvironment } from '../types';
  import { DefaultCatalogCollator } from '@backstage/plugin-catalog-backend';

  export default async function createPlugin({
    logger,
    discovery,
  }: PluginEnvironment) {
    // Initialize a connection to a search engine.
    const searchEngine = new LunrSearchEngine({ logger });
    const indexBuilder = new IndexBuilder({ logger, searchEngine });

    // Collators are responsible for gathering documents known to plugins. This
    // particular collator gathers entities from the software catalog.
    indexBuilder.addCollator({
      defaultRefreshIntervalSeconds: 600,
      collator: new DefaultCatalogCollator({ discovery }),
    });

    // The scheduler controls when documents are gathered from collators and sent
    // to the search engine for indexing.
    const { scheduler } = await indexBuilder.build();

    // A 3 second delay gives the backend server a chance to initialize before
    // any collators are executed, which may attempt requests against the API.
    setTimeout(() => scheduler.start(), 3000);
    useHotCleanup(module, () => scheduler.stop());

    return await createRouter({
      engine: indexBuilder.getSearchEngine(),
      logger,
    });
  }
  ```

  Then, ensure the search plugin you configured above is initialized by modifying
  your backend's `index.ts` file in the following ways:

  ```diff
  +import search from './plugins/search';
  // ...
  +const searchEnv = useHotMemoize(module, () => createEnv('search'));
  // ...
  +apiRouter.use('/search', await search(searchEnv));
  // ...
  ```

### Patch Changes

- db1c8f93b: The `<Search...Next /> set of components exported by the Search Plugin are now updated to use the Search Backend API. These will be made available as the default non-"next" versions in a follow-up release.

  The interfaces for decorators and collators in the Search Backend have also seen minor, breaking revisions ahead of a general release. If you happen to be building on top of these interfaces, check and update your implementations accordingly. The APIs will be considered more stable in a follow-up release.

- Updated dependencies [db1c8f93b]
  - @backstage/search-common@0.1.2

## 0.1.4

### Patch Changes

- e1e757569: Introduced Scheduler which is responsible for adding new tasks to a schedule together with it's interval timer as well as starting and stopping the scheduler processes.

## 0.1.3

### Patch Changes

- b9b2b4b76: Lunr Search Engine support

## 0.1.2

### Patch Changes

- 4d248725e: Bump to use the in-repo latest `backend-common`, and the correct version of `express-promise-router`
