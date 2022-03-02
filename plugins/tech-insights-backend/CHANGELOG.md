# @backstage/plugin-tech-insights-backend

## 0.2.7

### Patch Changes

- 67a7c02d26: Remove usages of `EntityRef` and `parseEntityName` from `@backstage/catalog-model`
- 919cf2f836: Minor updates to match the new `targetRef` field of relations, and to stop consuming the `target` field
- Updated dependencies
  - @backstage/backend-common@0.11.0
  - @backstage/catalog-model@0.11.0
  - @backstage/catalog-client@0.7.2
  - @backstage/plugin-tech-insights-node@0.2.5

## 0.2.6

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/backend-common@0.10.9
  - @backstage/catalog-client@0.7.1
  - @backstage/catalog-model@0.10.1
  - @backstage/config@0.1.15
  - @backstage/errors@0.2.2
  - @backstage/plugin-tech-insights-common@0.2.3
  - @backstage/plugin-tech-insights-node@0.2.4

## 0.2.5

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- 538ca90790: Use updated type names from `@backstage/catalog-client`
- Updated dependencies
  - @backstage/backend-common@0.10.8
  - @backstage/catalog-client@0.7.0
  - @backstage/errors@0.2.1
  - @backstage/catalog-model@0.10.0
  - @backstage/config@0.1.14
  - @backstage/plugin-tech-insights-common@0.2.2
  - @backstage/plugin-tech-insights-node@0.2.3

## 0.2.4

### Patch Changes

- 2441d1cf59: chore(deps): bump `knex` from 0.95.6 to 1.0.2

  This also replaces `sqlite3` with `@vscode/sqlite3` 5.0.7

- Updated dependencies
  - @backstage/catalog-client@0.6.0
  - @backstage/backend-common@0.10.7
  - @backstage/plugin-tech-insights-node@0.2.2

## 0.2.4-next.0

### Patch Changes

- 2441d1cf59: chore(deps): bump `knex` from 0.95.6 to 1.0.2

  This also replaces `sqlite3` with `@vscode/sqlite3` 5.0.7

- Updated dependencies
  - @backstage/backend-common@0.10.7-next.0
  - @backstage/plugin-tech-insights-node@0.2.2-next.0

## 0.2.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6
  - @backstage/plugin-tech-insights-node@0.2.1

## 0.2.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6-next.0
  - @backstage/plugin-tech-insights-node@0.2.1-next.0

## 0.2.2

### Patch Changes

- bbb6622752: Update README to match config options.
- Updated dependencies
  - @backstage/backend-common@0.10.5

## 0.2.1

### Patch Changes

- ad0a7eb088: Fixed invalid access that caused an immediate crash with a `TypeError` when loading the package.

## 0.2.0

### Minor Changes

- dfd5e81721: BREAKING CHANGES:

  - The helper function to create a fact retriever registration is now expecting an object of configuration items instead of individual arguments.
    Modify your `techInsights.ts` plugin configuration in `packages/backend/src/plugins/techInsights.ts` (or equivalent) the following way:

  ```diff
  -createFactRetrieverRegistration(
  -  '1 1 1 * *', // Example cron, At 01:01 on day-of-month 1.
  -  entityOwnershipFactRetriever,
  -),
  +createFactRetrieverRegistration({
  +  cadence: '1 1 1 * *', // Example cron, At 01:01 on day-of-month 1.
  +  factRetriever: entityOwnershipFactRetriever,
  +}),

  ```

  - `TechInsightsStore` interface has changed its signature of `insertFacts` method. If you have created your own implementation of either `TechInsightsDatabase` or `FactRetrieverEngine` you need to modify the implementation/call to this method to accept/pass-in an object instead if individual arguments. The interface now accepts an additional `lifecycle` argument which is optional (defined below). An example modification to fact retriever engine:

  ```diff
  -await this.repository.insertFacts(factRetriever.id, facts);
  +await this.repository.insertFacts({
  + id: factRetriever.id,
  + facts,
  + lifecycle,
  +});
  ```

  Adds a configuration option to fact retrievers to define lifecycle for facts the retriever persists. Possible values are either 'max items' or 'time-to-live'. The former will keep only n number of items in the database for each fact per entity. The latter will remove all facts that are older than the TTL value.

  Possible values:

  - `{ maxItems: 5 }` // Deletes all facts for the retriever/entity pair, apart from the last five
  - `{ ttl: 1209600000 }` // (2 weeks) Deletes all facts older than 2 weeks for the retriever/entity pair
  - `{ ttl: { weeks: 2 } }` // Deletes all facts older than 2 weeks for the retriever/entity pair

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.4
  - @backstage/config@0.1.13
  - @backstage/plugin-tech-insights-node@0.2.0
  - @backstage/catalog-model@0.9.10
  - @backstage/catalog-client@0.5.5

## 0.2.0-next.0

### Minor Changes

- dfd5e81721: BREAKING CHANGES:

  - The helper function to create a fact retriever registration is now expecting an object of configuration items instead of individual arguments.
    Modify your `techInsights.ts` plugin configuration in `packages/backend/src/plugins/techInsights.ts` (or equivalent) the following way:

  ```diff
  -createFactRetrieverRegistration(
  -  '1 1 1 * *', // Example cron, At 01:01 on day-of-month 1.
  -  entityOwnershipFactRetriever,
  -),
  +createFactRetrieverRegistration({
  +  cadence: '1 1 1 * *', // Example cron, At 01:01 on day-of-month 1.
  +  factRetriever: entityOwnershipFactRetriever,
  +}),

  ```

  - `TechInsightsStore` interface has changed its signature of `insertFacts` method. If you have created your own implementation of either `TechInsightsDatabase` or `FactRetrieverEngine` you need to modify the implementation/call to this method to accept/pass-in an object instead if individual arguments. The interface now accepts an additional `lifecycle` argument which is optional (defined below). An example modification to fact retriever engine:

  ```diff
  -await this.repository.insertFacts(factRetriever.id, facts);
  +await this.repository.insertFacts({
  + id: factRetriever.id,
  + facts,
  + lifecycle,
  +});
  ```

  Adds a configuration option to fact retrievers to define lifecycle for facts the retriever persists. Possible values are either 'max items' or 'time-to-live'. The former will keep only n number of items in the database for each fact per entity. The latter will remove all facts that are older than the TTL value.

  Possible values:

  - `{ maxItems: 5 }` // Deletes all facts for the retriever/entity pair, apart from the last five
  - `{ ttl: 1209600000 }` // (2 weeks) Deletes all facts older than 2 weeks for the retriever/entity pair
  - `{ ttl: { weeks: 2 } }` // Deletes all facts older than 2 weeks for the retriever/entity pair

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.4-next.0
  - @backstage/config@0.1.13-next.0
  - @backstage/plugin-tech-insights-node@0.2.0-next.0
  - @backstage/catalog-model@0.9.10-next.0
  - @backstage/catalog-client@0.5.5-next.0

## 0.1.5

### Patch Changes

- 19f0f93504: Catch errors from a fact retriever and log them.
- 10f26e8883: Modify queries to perform better by filtering on sub-queries as well
- a60eb0f0dd: adding new operation to run checks for multiple entities in one request
- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/backend-common@0.10.3
  - @backstage/plugin-tech-insights-common@0.2.1
  - @backstage/errors@0.2.0
  - @backstage/catalog-client@0.5.4
  - @backstage/catalog-model@0.9.9

## 0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.0
  - @backstage/catalog-client@0.5.3
  - @backstage/plugin-tech-insights-node@0.1.2

## 0.1.3

### Patch Changes

- b055a6addc: Align on usage of `cross-fetch` vs `node-fetch` in frontend vs backend packages, and remove some unnecessary imports of either one of them
- b5bd60fddc: Removed unnecessary check for specific server error in `@backstage plugin-tech-insights-backend`.
- c6c8b8e53e: Minor fixes in Readme to make the examples more directly usable.
- Updated dependencies
  - @backstage/plugin-tech-insights-common@0.2.0
  - @backstage/backend-common@0.9.12
  - @backstage/plugin-tech-insights-node@0.1.1

## 0.1.2

### Patch Changes

- 2017de90da: Update README docs to use correct function/parameter names
- Updated dependencies
  - @backstage/errors@0.1.5
  - @backstage/backend-common@0.9.11

## 0.1.1

### Patch Changes

- 5c00e45045: Add catalog fact retrievers

  Add fact retrievers which generate facts related to the completeness
  of entity data in the catalog.

- Updated dependencies
  - @backstage/catalog-client@0.5.2
  - @backstage/catalog-model@0.9.7
  - @backstage/backend-common@0.9.10
