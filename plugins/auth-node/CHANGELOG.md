# @backstage/plugin-auth-node

## 0.2.2

### Patch Changes

- 5ca0b86b88: Address corner cases where the key store was not being created at startup
- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- 9079a78078: Added configurable algorithms array for IdentityClient
- Updated dependencies
  - @backstage/backend-common@0.14.0

## 0.2.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.0-next.2

## 0.2.2-next.1

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/backend-common@0.13.6-next.1

## 0.2.2-next.0

### Patch Changes

- 9079a78078: Added configurable algorithms array for IdentityClient
- Updated dependencies
  - @backstage/backend-common@0.13.6-next.0

## 0.2.1

### Patch Changes

- 9ec4e0613e: Update to `jose` 4.6.0
- Updated dependencies
  - @backstage/backend-common@0.13.3
  - @backstage/config@1.0.1

## 0.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.2
  - @backstage/config@1.0.1-next.0

## 0.2.1-next.0

### Patch Changes

- 9ec4e0613e: Update to `jose` 4.6.0
- Updated dependencies
  - @backstage/backend-common@0.13.3-next.0

## 0.2.0

### Minor Changes

- 15d3a3c39a: **BREAKING**: Removed the deprecated `id` and `entity` fields from `BackstageSignInResult`.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.2

## 0.2.0-next.0

### Minor Changes

- 15d3a3c39a: **BREAKING**: Removed the deprecated `id` and `entity` fields from `BackstageSignInResult`.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.2-next.0

## 0.1.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.1
  - @backstage/catalog-model@1.0.0
  - @backstage/config@1.0.0
  - @backstage/errors@1.0.0

## 0.1.5

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.0
  - @backstage/catalog-model@0.13.0

## 0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0
  - @backstage/catalog-model@0.13.0-next.0

## 0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.12.0
  - @backstage/backend-common@0.12.0

## 0.1.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.11.0
  - @backstage/catalog-model@0.11.0

## 0.1.2

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/backend-common@0.10.9
  - @backstage/catalog-model@0.10.1
  - @backstage/config@0.1.15
  - @backstage/errors@0.2.2

## 0.1.1

### Patch Changes

- 1ed305728b: Bump `node-fetch` to version 2.6.7 and `cross-fetch` to version 3.1.5
- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/backend-common@0.10.8
  - @backstage/errors@0.2.1
  - @backstage/catalog-model@0.10.0
  - @backstage/config@0.1.14

## 0.1.0

### Minor Changes

- 9058bb1b5e: Added this package, to hold shared types and functionality that other backend
  packages need to import.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.7
