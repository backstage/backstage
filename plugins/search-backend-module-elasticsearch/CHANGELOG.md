# @backstage/plugin-search-backend-module-elasticsearch

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
