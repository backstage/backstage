# @backstage/backend-app-api

## 0.2.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.3.6-next.2
  - @backstage/backend-common@0.15.2-next.2
  - @backstage/plugin-permission-node@0.7.0-next.2
  - @backstage/backend-plugin-api@0.1.3-next.2
  - @backstage/errors@1.1.2-next.2

## 0.2.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.1
  - @backstage/backend-plugin-api@0.1.3-next.1
  - @backstage/backend-tasks@0.3.6-next.1
  - @backstage/errors@1.1.2-next.1
  - @backstage/plugin-permission-node@0.6.6-next.1

## 0.2.2-next.0

### Patch Changes

- 0027a749cd: Added possibility to configure index plugin of the HTTP router service.
- 45857bffae: Properly export `rootLoggerFactory`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.3-next.0
  - @backstage/backend-common@0.15.2-next.0
  - @backstage/backend-tasks@0.3.6-next.0
  - @backstage/plugin-permission-node@0.6.6-next.0
  - @backstage/errors@1.1.2-next.0

## 0.2.1

### Patch Changes

- 2c57c0c499: Made `ApiRef.defaultFactory` internal.
- 854ba37357: Updated to support new `ServiceFactory` formats.
- af6bb42c68: Updated `ServiceRegistry` to not initialize factories more than once.
- 409ed984e8: Updated service implementations and backend wiring to support scoped service.
- de3347ca74: Updated usages of `ServiceFactory`.
- 1f384c5644: Improved error messaging when failing to instantiate services.
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.2
  - @backstage/backend-common@0.15.1
  - @backstage/plugin-permission-node@0.6.5
  - @backstage/backend-tasks@0.3.5
  - @backstage/errors@1.1.1

## 0.2.1-next.2

### Patch Changes

- 854ba37357: Updated to support new `ServiceFactory` formats.
- 409ed984e8: Updated service implementations and backend wiring to support scoped service.
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.2-next.2
  - @backstage/errors@1.1.1-next.0
  - @backstage/backend-common@0.15.1-next.3
  - @backstage/backend-tasks@0.3.5-next.1
  - @backstage/plugin-permission-node@0.6.5-next.3

## 0.2.1-next.1

### Patch Changes

- 2c57c0c499: Made `ApiRef.defaultFactory` internal.
- af6bb42c68: Updated `ServiceRegistry` to not initialize factories more than once.
- 1f384c5644: Improved error messaging when failing to instantiate services.
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.2-next.1
  - @backstage/backend-common@0.15.1-next.2
  - @backstage/plugin-permission-node@0.6.5-next.2

## 0.2.1-next.0

### Patch Changes

- de3347ca74: Updated usages of `ServiceFactory`.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.0
  - @backstage/backend-tasks@0.3.5-next.0
  - @backstage/backend-plugin-api@0.1.2-next.0
  - @backstage/plugin-permission-node@0.6.5-next.0

## 0.2.0

### Minor Changes

- 5df230d48c: Introduced a new `backend-defaults` package carrying `createBackend` which was previously exported from `backend-app-api`.
  The `backend-app-api` package now exports the `createSpecializedBacked` that does not add any service factories by default.

### Patch Changes

- 0599732ec0: Refactored experimental backend system with new type names.
- Updated dependencies
  - @backstage/backend-common@0.15.0
  - @backstage/backend-plugin-api@0.1.1
  - @backstage/backend-tasks@0.3.4
  - @backstage/plugin-permission-node@0.6.4

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0-next.0
  - @backstage/backend-tasks@0.3.4-next.0
  - @backstage/backend-plugin-api@0.1.1-next.0
  - @backstage/plugin-permission-node@0.6.4-next.0

## 0.1.0

### Minor Changes

- 91c1d12123: Add initial plumbing for creating backends using the experimental backend framework.

  This package is highly **EXPERIMENTAL** and should not be used in production.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.1.0
  - @backstage/backend-common@0.14.1
  - @backstage/plugin-permission-node@0.6.3
  - @backstage/backend-tasks@0.3.3

## 0.1.0-next.0

### Minor Changes

- 91c1d12123: Add initial plumbing for creating backends using the experimental backend framework.

  This package is highly **EXPERIMENTAL** and should not be used in production.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.1.0-next.0
  - @backstage/backend-common@0.14.1-next.3
  - @backstage/plugin-permission-node@0.6.3-next.2
  - @backstage/backend-tasks@0.3.3-next.3
