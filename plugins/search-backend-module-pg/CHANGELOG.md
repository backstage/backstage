# @backstage/plugin-search-backend-module-pg

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
