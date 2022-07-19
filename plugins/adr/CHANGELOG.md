# @backstage/plugin-adr

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
