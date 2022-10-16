# @backstage/plugin-adr

## 0.2.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.2.0-next.2
  - @backstage/plugin-search-common@1.1.0-next.2
  - @backstage/catalog-model@1.1.2-next.2
  - @backstage/core-components@0.11.2-next.2
  - @backstage/core-plugin-api@1.0.7-next.2
  - @backstage/integration-react@1.1.5-next.2
  - @backstage/theme@0.2.16
  - @backstage/plugin-adr-common@0.2.2-next.2
  - @backstage/plugin-search-react@1.2.0-next.2

## 0.2.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.2.0-next.1
  - @backstage/plugin-search-react@1.2.0-next.1
  - @backstage/plugin-search-common@1.1.0-next.1
  - @backstage/core-components@0.11.2-next.1
  - @backstage/core-plugin-api@1.0.7-next.1
  - @backstage/catalog-model@1.1.2-next.1
  - @backstage/integration-react@1.1.5-next.1
  - @backstage/theme@0.2.16
  - @backstage/plugin-adr-common@0.2.2-next.1

## 0.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.2-next.0
  - @backstage/core-components@0.11.2-next.0
  - @backstage/plugin-adr-common@0.2.2-next.0
  - @backstage/plugin-catalog-react@1.1.5-next.0
  - @backstage/integration-react@1.1.5-next.0
  - @backstage/plugin-search-react@1.1.1-next.0
  - @backstage/core-plugin-api@1.0.7-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-search-common@1.0.2-next.0

## 0.2.1

### Patch Changes

- 817f3196f6: Updated React Router dependencies to be peer dependencies.
- eadf56bbbf: Bump `git-url-parse` version to `^13.0.0`
- 7d47def9c4: Removed dependency on `@types/jest`.
- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- c8bb0ff8ce: Minor cleanup of the public API surface to reduce the number of warnings
- b489de83b1: Fix parsing of ADR location which includes a trailing slash
- Updated dependencies
  - @backstage/core-components@0.11.1
  - @backstage/core-plugin-api@1.0.6
  - @backstage/plugin-catalog-react@1.1.4
  - @backstage/plugin-search-react@1.1.0
  - @backstage/catalog-model@1.1.1
  - @backstage/integration-react@1.1.4
  - @backstage/plugin-adr-common@0.2.1
  - @backstage/plugin-search-common@1.0.1

## 0.2.1-next.3

### Patch Changes

- 7d47def9c4: Removed dependency on `@types/jest`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.1.4-next.2
  - @backstage/catalog-model@1.1.1-next.0
  - @backstage/core-components@0.11.1-next.3
  - @backstage/core-plugin-api@1.0.6-next.3
  - @backstage/integration-react@1.1.4-next.2
  - @backstage/plugin-adr-common@0.2.1-next.1

## 0.2.1-next.2

### Patch Changes

- eadf56bbbf: Bump `git-url-parse` version to `^13.0.0`
- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- Updated dependencies
  - @backstage/core-components@0.11.1-next.2
  - @backstage/core-plugin-api@1.0.6-next.2
  - @backstage/integration-react@1.1.4-next.1
  - @backstage/plugin-search-react@1.1.0-next.2

## 0.2.1-next.1

### Patch Changes

- 817f3196f6: Updated React Router dependencies to be peer dependencies.
- b489de83b1: Fix parsing of ADR location which includes a trailing slash
- Updated dependencies
  - @backstage/core-components@0.11.1-next.1
  - @backstage/core-plugin-api@1.0.6-next.1
  - @backstage/plugin-catalog-react@1.1.4-next.1
  - @backstage/plugin-search-react@1.0.2-next.1

## 0.2.1-next.0

### Patch Changes

- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- c8bb0ff8ce: Minor cleanup of the public API surface to reduce the number of warnings
- Updated dependencies
  - @backstage/core-plugin-api@1.0.6-next.0
  - @backstage/core-components@0.11.1-next.0
  - @backstage/integration-react@1.1.4-next.0
  - @backstage/plugin-catalog-react@1.1.4-next.0
  - @backstage/plugin-search-react@1.0.2-next.0
  - @backstage/plugin-adr-common@0.2.1-next.0
  - @backstage/plugin-search-common@1.0.1-next.0

## 0.2.0

### Minor Changes

- bfc7c50a09: Display associated entity as a chip in `AdrSearchResultListItem`

  BREAKING: `AdrDocument` now includes a `entityRef` property, if you have a custom `AdrParser` you will have to supply this property in your returned documents

### Patch Changes

- Updated dependencies
  - @backstage/plugin-adr-common@0.2.0
  - @backstage/core-components@0.11.0
  - @backstage/core-plugin-api@1.0.5
  - @backstage/plugin-catalog-react@1.1.3
  - @backstage/integration-react@1.1.3
  - @backstage/plugin-search-react@1.0.1

## 0.2.0-next.2

### Minor Changes

- bfc7c50a09: Display associated entity as a chip in `AdrSearchResultListItem`

  BREAKING: `AdrDocument` now includes a `entityRef` property, if you have a custom `AdrParser` you will have to supply this property in your returned documents

### Patch Changes

- Updated dependencies
  - @backstage/plugin-adr-common@0.2.0-next.1

## 0.1.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.1.3-next.2
  - @backstage/core-components@0.11.0-next.2
  - @backstage/integration-react@1.1.3-next.1
  - @backstage/plugin-search-react@1.0.1-next.1

## 0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.0.5-next.0
  - @backstage/integration-react@1.1.3-next.0
  - @backstage/plugin-adr-common@0.1.3-next.0
  - @backstage/plugin-catalog-react@1.1.3-next.0
  - @backstage/core-components@0.10.1-next.0
  - @backstage/plugin-search-react@1.0.1-next.0

## 0.1.2

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 8006d0f9bf: Updated dependency `msw` to `^0.44.0`.
- 511f49ee43: Updated dependency `octokit` to `^2.0.0`.
- e2d7b76f43: Upgrade git-url-parse to 12.0.0.

  Motivation for upgrade is transitively upgrading parse-url which is vulnerable
  to several CVEs detected by Snyk.

  - SNYK-JS-PARSEURL-2935944
  - SNYK-JS-PARSEURL-2935947
  - SNYK-JS-PARSEURL-2936249

- 7d47e7e512: Track discover event and result rank for `AdrSearchResultListItem`
- Updated dependencies
  - @backstage/core-components@0.10.0
  - @backstage/plugin-search-react@1.0.0
  - @backstage/plugin-search-common@1.0.0
  - @backstage/core-plugin-api@1.0.4
  - @backstage/integration-react@1.1.2
  - @backstage/plugin-catalog-react@1.1.2
  - @backstage/theme@0.2.16
  - @backstage/plugin-adr-common@0.1.2

## 0.1.2-next.3

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 511f49ee43: Updated dependency `octokit` to `^2.0.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.0.4-next.0
  - @backstage/core-components@0.10.0-next.3
  - @backstage/integration-react@1.1.2-next.3
  - @backstage/plugin-catalog-react@1.1.2-next.3
  - @backstage/plugin-search-react@0.2.2-next.3

## 0.1.2-next.2

### Patch Changes

- e2d7b76f43: Upgrade git-url-parse to 12.0.0.

  Motivation for upgrade is transitively upgrading parse-url which is vulnerable
  to several CVEs detected by Snyk.

  - SNYK-JS-PARSEURL-2935944
  - SNYK-JS-PARSEURL-2935947
  - SNYK-JS-PARSEURL-2936249

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/plugin-search-react@0.2.2-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2
  - @backstage/integration-react@1.1.2-next.2

## 0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.6-next.1
  - @backstage/theme@0.2.16-next.0
  - @backstage/integration-react@1.1.2-next.1
  - @backstage/plugin-adr-common@0.1.2-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.1
  - @backstage/plugin-search-common@0.3.6-next.0
  - @backstage/plugin-search-react@0.2.2-next.1

## 0.1.2-next.0

### Patch Changes

- 7d47e7e512: Track discover event and result rank for `AdrSearchResultListItem`
- Updated dependencies
  - @backstage/core-components@0.9.6-next.0
  - @backstage/plugin-adr-common@0.1.2-next.0
  - @backstage/plugin-catalog-react@1.1.2-next.0
  - @backstage/integration-react@1.1.2-next.0
  - @backstage/plugin-search-react@0.2.2-next.0

## 0.1.1

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- a6458a120b: Adding term highlighting support to `AdrSearchResultListItem`
- Updated dependencies
  - @backstage/plugin-catalog-react@1.1.1
  - @backstage/plugin-search-common@0.3.5
  - @backstage/plugin-search-react@0.2.1
  - @backstage/core-components@0.9.5
  - @backstage/core-plugin-api@1.0.3
  - @backstage/integration-react@1.1.1
  - @backstage/plugin-adr-common@0.1.1

## 0.1.1-next.1

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/core-components@0.9.5-next.1
  - @backstage/core-plugin-api@1.0.3-next.0
  - @backstage/integration-react@1.1.1-next.1
  - @backstage/plugin-catalog-react@1.1.1-next.1
  - @backstage/plugin-search-react@0.2.1-next.0
  - @backstage/plugin-search-common@0.3.5-next.0
  - @backstage/plugin-adr-common@0.1.1-next.1

## 0.1.1-next.0

### Patch Changes

- a6458a120b: Adding term highlighting support to `AdrSearchResultListItem`
- Updated dependencies
  - @backstage/plugin-catalog-react@1.1.1-next.0
  - @backstage/core-components@0.9.5-next.0
  - @backstage/integration-react@1.1.1-next.0
  - @backstage/plugin-adr-common@0.1.1-next.0

## 0.1.0

### Minor Changes

- e73075a301: Implement ADR plugin

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.4
  - @backstage/plugin-adr-common@0.1.0
  - @backstage/core-plugin-api@1.0.2
  - @backstage/plugin-catalog-react@1.1.0
  - @backstage/integration-react@1.1.0

## 0.1.0-next.0

### Minor Changes

- e73075a301: Implement ADR plugin

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.4-next.0
  - @backstage/plugin-adr-common@0.1.0-next.0
  - @backstage/core-plugin-api@1.0.2-next.0
  - @backstage/plugin-catalog-react@1.1.0-next.1
  - @backstage/integration-react@1.1.0-next.1
