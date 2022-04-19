# @backstage/plugin-search-backend-module-elasticsearch

## 0.1.3

### Patch Changes

- 62ee65422c: Use new `IndexableResultSet` type as return type of query method in `SearchEngine` implementation.
- Updated dependencies
  - @backstage/plugin-search-common@0.3.3
  - @backstage/plugin-search-backend-node@0.6.0

## 0.1.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-search-backend-node@0.6.0-next.1

## 0.1.3-next.0

### Patch Changes

- 62ee65422c: Use new `IndexableResultSet` type as return type of query method in `SearchEngine` implementation.
- Updated dependencies
  - @backstage/plugin-search-common@0.3.3-next.0
  - @backstage/plugin-search-backend-node@0.5.3-next.0

## 0.1.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.0
  - @backstage/plugin-search-backend-node@0.5.2
  - @backstage/plugin-search-common@0.3.2

## 0.1.1

### Patch Changes

- 3e54f6c436: Use `@backstage/plugin-search-common` package instead of `@backstage/search-common`.
- Updated dependencies
  - @backstage/plugin-search-common@0.3.1
  - @backstage/plugin-search-backend-node@0.5.1

## 0.1.1-next.0

### Patch Changes

- 3e54f6c436: Use `@backstage/plugin-search-common` package instead of `@backstage/search-common`.
- Updated dependencies
  - @backstage/plugin-search-common@0.3.1-next.0
  - @backstage/plugin-search-backend-node@0.5.1-next.0

## 0.1.0

### Minor Changes

- 022507c860: **BREAKING**

  The `ElasticSearchSearchEngine` implements the new stream-based indexing
  process expected by the latest `@backstage/search-backend-node`.

  When updating to this version, you must also update to the latest version of
  `@backstage/search-backend-node`. Check [this upgrade guide](https://backstage.io/docs/features/search/how-to-guides#how-to-migrate-from-search-alpha-to-beta)
  for further details.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-search-backend-node@0.5.0
  - @backstage/search-common@0.3.0

## 0.0.10

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/config@0.1.15
  - @backstage/search-common@0.2.4

## 0.0.9

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- 4c0332e55c: chore(deps-dev): bump `@elastic/elasticsearch-mock` from 0.3.0 to 1.0.0
- Updated dependencies
  - @backstage/config@0.1.14
  - @backstage/search-common@0.2.3

## 0.0.8

### Patch Changes

- Updated dependencies
  - @backstage/config@0.1.13

## 0.0.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@0.1.13-next.0

## 0.0.7

### Patch Changes

- 68512f5178: Add `newClient()` method to re-use the configuration of the elastic search
  engine with custom clients

## 0.0.6

### Patch Changes

- dcd1a0c3f4: Minor improvement to the API reports, by not unpacking arguments directly

## 0.0.5

### Patch Changes

- 36350bf8b3: Pinning version of elastic search client to 7.13.0 to prevent breaking change towards third party ElasticSearch clusters on 7.14.0.

## 0.0.4

### Patch Changes

- f0c2c81676: Added rejectUnauthorized config option

## 0.0.3

### Patch Changes

- a13f21cdc: Implement optional `pageCursor` based paging in search.

  To use paging in your app, add a `<SearchResultPager />` to your
  `SearchPage.tsx`.

- Updated dependencies
  - @backstage/search-common@0.2.0

## 0.0.2

### Patch Changes

- 76872096b: Fix to allow optionally reading `auth` parameter for custom hosted ElasticSearch instances. Also remove `bearer` auth config since it's currently unsupported.
