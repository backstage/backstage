# @backstage/plugin-search-backend

## 0.5.2-next.0

### Patch Changes

- 8cc75993a6: Fixed issue in `PermissionEvaluator` instance check that would cause unexpected "invalid union" errors.
- Updated dependencies
  - @backstage/backend-common@0.13.3-next.0
  - @backstage/plugin-auth-node@0.2.1-next.0
  - @backstage/plugin-permission-node@0.6.1-next.0
  - @backstage/plugin-search-backend-node@0.6.1-next.0

## 0.5.0

### Minor Changes

- 94ccd772d4: **BREAKING**: The `authorization` property is no longer returned on search results when queried. Note: this will only result in a breaking change if you have custom code in your frontend that relies on the `authorization.resourceRef` property on documents.

### Patch Changes

- 30f9884359: Check for non-resource permissions when authorizing result-by-result in AuthorizedSearchEngine.
- 3c8cfaaa80: Use `PermissionEvaluator` instead of `PermissionAuthorizer`, which is now deprecated.
- 62ee65422c: Use new `IndexableResultSet` type as return type of query method in `SearchEngine` implementation.
- c98d271466: Use updated types from `@backstage/plugin-permission-common`
- Updated dependencies
  - @backstage/plugin-permission-common@0.6.0
  - @backstage/plugin-permission-node@0.6.0
  - @backstage/plugin-auth-node@0.2.0
  - @backstage/plugin-search-common@0.3.3
  - @backstage/backend-common@0.13.2
  - @backstage/plugin-search-backend-node@0.6.0

## 0.5.0-next.2

### Patch Changes

- 3c8cfaaa80: Use `PermissionEvaluator` instead of `PermissionAuthorizer`, which is now deprecated.
- Updated dependencies
  - @backstage/plugin-permission-common@0.6.0-next.1
  - @backstage/plugin-permission-node@0.6.0-next.2
  - @backstage/backend-common@0.13.2-next.2
  - @backstage/plugin-search-backend-node@0.6.0-next.1

## 0.5.0-next.1

### Patch Changes

- 30f9884359: Check for non-resource permissions when authorizing result-by-result in AuthorizedSearchEngine.
- c98d271466: Use updated types from `@backstage/plugin-permission-common`
- Updated dependencies
  - @backstage/plugin-permission-common@0.6.0-next.0
  - @backstage/plugin-permission-node@0.6.0-next.1
  - @backstage/backend-common@0.13.2-next.1
  - @backstage/plugin-search-common@0.3.3-next.1

## 0.5.0-next.0

### Minor Changes

- 94ccd772d4: **BREAKING**: The `authorization` property is no longer returned on search results when queried. Note: this will only result in a breaking change if you have custom code in your frontend that relies on the `authorization.resourceRef` property on documents.

### Patch Changes

- 62ee65422c: Use new `IndexableResultSet` type as return type of query method in `SearchEngine` implementation.
- Updated dependencies
  - @backstage/plugin-auth-node@0.2.0-next.0
  - @backstage/plugin-search-common@0.3.3-next.0
  - @backstage/plugin-search-backend-node@0.5.3-next.0
  - @backstage/backend-common@0.13.2-next.0
  - @backstage/plugin-permission-node@0.5.6-next.0

## 0.4.8

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.1
  - @backstage/config@1.0.0
  - @backstage/errors@1.0.0
  - @backstage/types@1.0.0
  - @backstage/plugin-permission-common@0.5.3
  - @backstage/plugin-search-backend-node@0.5.2
  - @backstage/plugin-auth-node@0.1.6
  - @backstage/plugin-permission-node@0.5.5
  - @backstage/plugin-search-common@0.3.2

## 0.4.7

### Patch Changes

- 3e54f6c436: Use `@backstage/plugin-search-common` package instead of `@backstage/search-common`.
- Updated dependencies
  - @backstage/backend-common@0.13.0
  - @backstage/plugin-search-common@0.3.1
  - @backstage/plugin-search-backend-node@0.5.1
  - @backstage/plugin-auth-node@0.1.5
  - @backstage/plugin-permission-node@0.5.4

## 0.4.7-next.0

### Patch Changes

- 3e54f6c436: Use `@backstage/plugin-search-common` package instead of `@backstage/search-common`.
- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0
  - @backstage/plugin-search-common@0.3.1-next.0
  - @backstage/plugin-search-backend-node@0.5.1-next.0
  - @backstage/plugin-auth-node@0.1.5-next.0
  - @backstage/plugin-permission-node@0.5.4-next.0

## 0.4.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.12.0
  - @backstage/plugin-permission-common@0.5.2
  - @backstage/plugin-permission-node@0.5.3
  - @backstage/plugin-search-backend-node@0.5.0
  - @backstage/search-common@0.3.0
  - @backstage/plugin-auth-node@0.1.4

## 0.4.5

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.11.0
  - @backstage/plugin-permission-node@0.5.2
  - @backstage/plugin-auth-node@0.1.3

## 0.4.4

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/backend-common@0.10.9
  - @backstage/config@0.1.15
  - @backstage/errors@0.2.2
  - @backstage/search-common@0.2.4
  - @backstage/types@0.1.3
  - @backstage/plugin-auth-node@0.1.2
  - @backstage/plugin-permission-common@0.5.1
  - @backstage/plugin-permission-node@0.5.1
  - @backstage/plugin-search-backend-node@0.4.7

## 0.4.3

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/backend-common@0.10.8
  - @backstage/errors@0.2.1
  - @backstage/plugin-auth-node@0.1.1
  - @backstage/plugin-permission-common@0.5.0
  - @backstage/config@0.1.14
  - @backstage/search-common@0.2.3
  - @backstage/types@0.1.2
  - @backstage/plugin-permission-node@0.5.0
  - @backstage/plugin-search-backend-node@0.4.6

## 0.4.2

### Patch Changes

- b3f3e42036: Use `getBearerTokenFromAuthorizationHeader` from `@backstage/plugin-auth-node` instead of the deprecated `IdentityClient` method.
- Updated dependencies
  - @backstage/backend-common@0.10.7
  - @backstage/plugin-auth-node@0.1.0
  - @backstage/plugin-permission-node@0.4.3

## 0.4.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.10.0-next.0
  - @backstage/backend-common@0.10.7-next.0
  - @backstage/plugin-permission-node@0.4.3-next.0

## 0.4.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.9.0
  - @backstage/backend-common@0.10.6
  - @backstage/plugin-permission-node@0.4.2

## 0.4.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.9.0-next.1
  - @backstage/backend-common@0.10.6-next.0
  - @backstage/plugin-permission-node@0.4.2-next.1

## 0.4.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.9.0-next.0
  - @backstage/plugin-permission-node@0.4.2-next.0

## 0.4.0

### Minor Changes

- bbfbc755aa: **BREAKING** Added three additional required properties to `createRouter` to support filtering search results based on permissions. To make this change to an existing app, add the required parameters to the `createRouter` call in `packages/backend/src/plugins/search.ts`:

  ```diff
  export default async function createPlugin({
    logger,
  +  permissions,
    discovery,
    config,
    tokenManager,
  }: PluginEnvironment) {
    /* ... */

    return await createRouter({
      engine: indexBuilder.getSearchEngine(),
  +    types: indexBuilder.getDocumentTypes(),
  +    permissions,
  +    config,
      logger,
    });
  }
  ```

### Patch Changes

- Updated dependencies
  - @backstage/plugin-search-backend-node@0.4.5
  - @backstage/plugin-auth-backend@0.8.0
  - @backstage/search-common@0.2.2
  - @backstage/backend-common@0.10.5
  - @backstage/plugin-permission-node@0.4.1

## 0.3.1

### Patch Changes

- cd6854046e: Validate query string in search endpoint
- Updated dependencies
  - @backstage/backend-common@0.10.4
  - @backstage/config@0.1.13

## 0.3.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.4-next.0

## 0.3.0

### Minor Changes

- a41fbfe739: Search result location filtering

  This change introduces a filter for search results based on their location protocol. The intention is to filter out unsafe or
  malicious values before they can be consumed by the frontend. By default locations must be http/https URLs (or paths).

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.0

## 0.2.8

### Patch Changes

- dcd1a0c3f4: Minor improvement to the API reports, by not unpacking arguments directly
- Updated dependencies
  - @backstage/backend-common@0.9.13

## 0.2.7

### Patch Changes

- bab752e2b3: Change default port of backend from 7000 to 7007.

  This is due to the AirPlay Receiver process occupying port 7000 and preventing local Backstage instances on MacOS to start.

  You can change the port back to 7000 or any other value by providing an `app-config.yaml` with the following values:

  ```
  backend:
    listen: 0.0.0.0:7123
    baseUrl: http://localhost:7123
  ```

  More information can be found here: https://backstage.io/docs/conf/writing

- Updated dependencies
  - @backstage/backend-common@0.9.11

## 0.2.6

### Patch Changes

- a13f21cdc: Implement optional `pageCursor` based paging in search.

  To use paging in your app, add a `<SearchResultPager />` to your
  `SearchPage.tsx`.

- Updated dependencies
  - @backstage/search-common@0.2.0
  - @backstage/plugin-search-backend-node@0.4.2
  - @backstage/backend-common@0.9.1

## 0.2.5

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.9.0

## 0.2.4

### Patch Changes

- 64baedea5: Improve search query logging message
- Updated dependencies
  - @backstage/backend-common@0.8.10

## 0.2.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.8.6
  - @backstage/plugin-search-backend-node@0.4.0

## 0.2.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.8.5
  - @backstage/plugin-search-backend-node@0.3.0

## 0.2.1

### Patch Changes

- 3108ff7bf: Make `yarn dev` respect the `PLUGIN_PORT` environment variable.
- Updated dependencies
  - @backstage/plugin-search-backend-node@0.2.1
  - @backstage/backend-common@0.8.3

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

- Updated dependencies [92963779b]
- Updated dependencies [db1c8f93b]
- Updated dependencies [5aff84759]
- Updated dependencies [eda9dbd5f]
  - @backstage/backend-common@0.8.2
  - @backstage/search-common@0.1.2
  - @backstage/plugin-search-backend-node@0.2.0

## 0.1.5

### Patch Changes

- Updated dependencies [22fd8ce2a]
- Updated dependencies [f9fb4a205]
  - @backstage/backend-common@0.8.0

## 0.1.4

### Patch Changes

- Updated dependencies [e0bfd3d44]
- Updated dependencies [38ca05168]
  - @backstage/backend-common@0.7.0

## 0.1.3

### Patch Changes

- b9b2b4b76: Lunr Search Engine support
- Updated dependencies [b9b2b4b76]
- Updated dependencies [d367f63b5]
- Updated dependencies [b42531cfe]
  - @backstage/plugin-search-backend-node@0.1.3
  - @backstage/backend-common@0.6.3

## 0.1.2

### Patch Changes

- 4d248725e: Bump to use the in-repo latest `backend-common`, and the correct version of `express-promise-router`
