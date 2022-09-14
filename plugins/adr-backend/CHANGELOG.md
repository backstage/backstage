# @backstage/plugin-adr-backend

## 0.2.1-next.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.1.0-next.2
  - @backstage/catalog-model@1.1.1-next.0
  - @backstage/config@1.0.2-next.0
  - @backstage/errors@1.1.1-next.0
  - @backstage/integration@1.3.1-next.2
  - @backstage/backend-common@0.15.1-next.3
  - @backstage/plugin-adr-common@0.2.1-next.1

## 0.2.1-next.2

### Patch Changes

- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.2
  - @backstage/integration@1.3.1-next.1
  - @backstage/catalog-client@1.0.5-next.1

## 0.2.1-next.1

### Patch Changes

- b489de83b1: Continue processing subsequent entities when an error occurs in collator
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.1

## 0.2.1-next.0

### Patch Changes

- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.0
  - @backstage/catalog-client@1.0.5-next.0
  - @backstage/integration@1.3.1-next.0
  - @backstage/plugin-adr-common@0.2.1-next.0
  - @backstage/plugin-search-common@1.0.1-next.0

## 0.2.0

### Minor Changes

- bfc7c50a09: Display associated entity as a chip in `AdrSearchResultListItem`

  BREAKING: `AdrDocument` now includes a `entityRef` property, if you have a custom `AdrParser` you will have to supply this property in your returned documents

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0
  - @backstage/plugin-adr-common@0.2.0
  - @backstage/integration@1.3.0

## 0.2.0-next.1

### Minor Changes

- bfc7c50a09: Display associated entity as a chip in `AdrSearchResultListItem`

  BREAKING: `AdrDocument` now includes a `entityRef` property, if you have a custom `AdrParser` you will have to supply this property in your returned documents

### Patch Changes

- Updated dependencies
  - @backstage/plugin-adr-common@0.2.0-next.1
  - @backstage/backend-common@0.15.0-next.2

## 0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0-next.0
  - @backstage/integration@1.3.0-next.0
  - @backstage/plugin-adr-common@0.1.3-next.0

## 0.1.2

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 4e9a90e307: Updated dependency `luxon` to `^3.0.0`.
- 8006d0f9bf: Updated dependency `msw` to `^0.44.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.1
  - @backstage/catalog-model@1.1.0
  - @backstage/plugin-search-common@1.0.0
  - @backstage/integration@1.2.2
  - @backstage/catalog-client@1.0.4
  - @backstage/errors@1.1.0
  - @backstage/plugin-adr-common@0.1.2

## 0.1.2-next.2

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 4e9a90e307: Updated dependency `luxon` to `^3.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.1-next.3
  - @backstage/catalog-client@1.0.4-next.2
  - @backstage/integration@1.2.2-next.3
  - @backstage/catalog-model@1.1.0-next.3

## 0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.1
  - @backstage/backend-common@0.14.1-next.1
  - @backstage/errors@1.1.0-next.0
  - @backstage/catalog-client@1.0.4-next.1
  - @backstage/integration@1.2.2-next.1
  - @backstage/plugin-adr-common@0.1.2-next.1
  - @backstage/plugin-search-common@0.3.6-next.0

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.0
  - @backstage/catalog-model@1.1.0-next.0
  - @backstage/integration@1.2.2-next.0
  - @backstage/catalog-client@1.0.4-next.0
  - @backstage/plugin-adr-common@0.1.2-next.0

## 0.1.1

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/plugin-search-common@0.3.5
  - @backstage/backend-common@0.14.0
  - @backstage/integration@1.2.1
  - @backstage/catalog-client@1.0.3
  - @backstage/catalog-model@1.0.3
  - @backstage/plugin-adr-common@0.1.1

## 0.1.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-search-common@0.3.5-next.1
  - @backstage/backend-common@0.14.0-next.2
  - @backstage/integration@1.2.1-next.2

## 0.1.1-next.1

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/backend-common@0.13.6-next.1
  - @backstage/catalog-client@1.0.3-next.0
  - @backstage/integration@1.2.1-next.1
  - @backstage/catalog-model@1.0.3-next.0
  - @backstage/plugin-search-common@0.3.5-next.0
  - @backstage/plugin-adr-common@0.1.1-next.1

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.6-next.0
  - @backstage/integration@1.2.1-next.0
  - @backstage/plugin-adr-common@0.1.1-next.0

## 0.1.0

### Minor Changes

- e73075a301: Implement ADR plugin

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3
  - @backstage/plugin-adr-common@0.1.0
  - @backstage/integration@1.2.0
  - @backstage/config@1.0.1
  - @backstage/plugin-search-common@0.3.4
  - @backstage/catalog-client@1.0.2
  - @backstage/catalog-model@1.0.2

## 0.1.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.2
  - @backstage/config@1.0.1-next.0
  - @backstage/plugin-search-common@0.3.4-next.0
  - @backstage/catalog-model@1.0.2-next.0
  - @backstage/integration@1.2.0-next.1
  - @backstage/plugin-adr-common@0.1.0-next.1
  - @backstage/catalog-client@1.0.2-next.0

## 0.1.0-next.0

### Minor Changes

- e73075a301: Implement ADR plugin

### Patch Changes

- Updated dependencies
  - @backstage/plugin-adr-common@0.1.0-next.0
  - @backstage/backend-common@0.13.3-next.1
