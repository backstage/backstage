# @backstage/plugin-search-backend-module-pg

## 0.3.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.0
  - @backstage/plugin-search-backend-node@0.6.1-next.0

## 0.3.2

### Patch Changes

- 62ee65422c: Use new `IndexableResultSet` type as return type of query method in `SearchEngine` implementation.
- Updated dependencies
  - @backstage/plugin-search-common@0.3.3
  - @backstage/backend-common@0.13.2
  - @backstage/plugin-search-backend-node@0.6.0

## 0.3.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.2-next.2
  - @backstage/plugin-search-backend-node@0.6.0-next.1

## 0.3.2-next.0

### Patch Changes

- 62ee65422c: Use new `IndexableResultSet` type as return type of query method in `SearchEngine` implementation.
- Updated dependencies
  - @backstage/plugin-search-common@0.3.3-next.0
  - @backstage/plugin-search-backend-node@0.5.3-next.0
  - @backstage/backend-common@0.13.2-next.0

## 0.3.1

### Patch Changes

- 3e54f6c436: Use `@backstage/plugin-search-common` package instead of `@backstage/search-common`.
- Updated dependencies
  - @backstage/backend-common@0.13.0
  - @backstage/plugin-search-common@0.3.1
  - @backstage/plugin-search-backend-node@0.5.1

## 0.3.1-next.0

### Patch Changes

- 3e54f6c436: Use `@backstage/plugin-search-common` package instead of `@backstage/search-common`.
- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0
  - @backstage/plugin-search-common@0.3.1-next.0
  - @backstage/plugin-search-backend-node@0.5.1-next.0

## 0.3.0

### Minor Changes

- 022507c860: **BREAKING**

  The `PgSearchEngine` implements the new stream-based indexing process expected
  by the latest `@backstage/search-backend-node`.

  When updating to this version, you must also update to the latest version of
  `@backstage/search-backend-node`. Check [this upgrade guide](https://backstage.io/docs/features/search/how-to-guides#how-to-migrate-from-search-alpha-to-beta)
  for further details.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.12.0
  - @backstage/plugin-search-backend-node@0.5.0
  - @backstage/search-common@0.3.0

## 0.2.9

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.11.0

## 0.2.8

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/backend-common@0.10.9
  - @backstage/search-common@0.2.4
  - @backstage/plugin-search-backend-node@0.4.7

## 0.2.7

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/backend-common@0.10.8
  - @backstage/search-common@0.2.3
  - @backstage/plugin-search-backend-node@0.4.6

## 0.2.6

### Patch Changes

- 2441d1cf59: chore(deps): bump `knex` from 0.95.6 to 1.0.2

  This also replaces `sqlite3` with `@vscode/sqlite3` 5.0.7

- Updated dependencies
  - @backstage/backend-common@0.10.7

## 0.2.6-next.0

### Patch Changes

- 2441d1cf59: chore(deps): bump `knex` from 0.95.6 to 1.0.2

  This also replaces `sqlite3` with `@vscode/sqlite3` 5.0.7

- Updated dependencies
  - @backstage/backend-common@0.10.7-next.0

## 0.2.5

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6

## 0.2.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6-next.0

## 0.2.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.4

## 0.2.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.4-next.0

## 0.2.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.0

## 0.2.2

### Patch Changes

- dcd1a0c3f4: Minor improvement to the API reports, by not unpacking arguments directly
- Updated dependencies
  - @backstage/backend-common@0.9.13

## 0.2.1

### Patch Changes

- febddedcb2: Bump `lodash` to remediate `SNYK-JS-LODASH-590103` security vulnerability
- Updated dependencies
  - @backstage/backend-common@0.9.4

## 0.2.0

### Minor Changes

- a13f21cdc: Implement optional `pageCursor` based paging in search.

  To use paging in your app, add a `<SearchResultPager />` to your
  `SearchPage.tsx`.

### Patch Changes

- Updated dependencies
  - @backstage/search-common@0.2.0
  - @backstage/plugin-search-backend-node@0.4.2
  - @backstage/backend-common@0.9.1

## 0.1.3

### Patch Changes

- 80c562039: Sanitize special characters before building search query for postgres
- Updated dependencies
  - @backstage/backend-common@0.9.0

## 0.1.2

### Patch Changes

- ee99798da: Correct version requirements on postgres from 11 to 12. Postgres 12 is required
  due the use of generated columns.
- Updated dependencies
  - @backstage/backend-common@0.8.10

## 0.1.1

### Patch Changes

- 9255e1430: Add `plugin-search-backend-module-pg` providing a postgres based search engine.
  See the [README of `search-backend-module-pg`](https://github.com/backstage/backstage/blob/master/plugins/search-backend-module-pg/README.md) for usage instructions.
- Updated dependencies
  - @backstage/backend-common@0.8.9
