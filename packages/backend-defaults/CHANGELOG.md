# @backstage/backend-defaults

## 0.1.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.3.1
  - @backstage/backend-plugin-api@0.3.1

## 0.1.5

### Patch Changes

- 6cfd4d7073: Include implementations for the new `rootLifecycleServiceRef`.
- ecc6bfe4c9: Use new `ServiceFactoryOrFunction` type.
- 015a6dced6: Updated to make sure that service implementations replace default service implementations.
- 843a0a158c: Added factory for the new core identity service to the set of default service factories.
- 5b7bcd3c5e: Added support to supply a shared environment to `createBackend`, which can be created using `createSharedEnvironment` from `@backstage/backend-plugin-api`.
- 02b119ff93: The new root HTTP router service is now installed by default.
- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0
  - @backstage/backend-app-api@0.3.0

## 0.1.5-next.1

### Patch Changes

- ecc6bfe4c9: Use new `ServiceFactoryOrFunction` type.
- 015a6dced6: Updated to make sure that service implementations replace default service implementations.
- 02b119ff93: The new root HTTP router service is now installed by default.
- Updated dependencies
  - @backstage/backend-app-api@0.3.0-next.1
  - @backstage/backend-plugin-api@0.3.0-next.1

## 0.1.5-next.0

### Patch Changes

- 6cfd4d7073: Include implementations for the new `rootLifecycleServiceRef`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/backend-app-api@0.2.5-next.0

## 0.1.4

### Patch Changes

- d6dbf1792b: Added `lifecycleFactory` to default service factories.
- Updated dependencies
  - @backstage/backend-app-api@0.2.4
  - @backstage/backend-plugin-api@0.2.0

## 0.1.4-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.2.4-next.3
  - @backstage/backend-plugin-api@0.2.0-next.3

## 0.1.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.2.4-next.2
  - @backstage/backend-plugin-api@0.2.0-next.2

## 0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.2.4-next.1
  - @backstage/backend-plugin-api@0.1.5-next.1

## 0.1.4-next.0

### Patch Changes

- d6dbf1792b: Added `lifecycleFactory` to default service factories.
- Updated dependencies
  - @backstage/backend-app-api@0.2.4-next.0
  - @backstage/backend-plugin-api@0.1.5-next.0

## 0.1.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.2.3
  - @backstage/backend-plugin-api@0.1.4

## 0.1.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.2.3-next.1
  - @backstage/backend-plugin-api@0.1.4-next.1

## 0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.2.3-next.0
  - @backstage/backend-plugin-api@0.1.4-next.0

## 0.1.2

### Patch Changes

- 96d288a02d: Added root logger service to the set of default services.
- Updated dependencies
  - @backstage/backend-app-api@0.2.2
  - @backstage/backend-plugin-api@0.1.3

## 0.1.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.2.2-next.2
  - @backstage/backend-plugin-api@0.1.3-next.2

## 0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.1.3-next.1
  - @backstage/backend-app-api@0.2.2-next.1

## 0.1.2-next.0

### Patch Changes

- 96d288a02d: Added root logger service to the set of default services.
- Updated dependencies
  - @backstage/backend-app-api@0.2.2-next.0
  - @backstage/backend-plugin-api@0.1.3-next.0

## 0.1.1

### Patch Changes

- 854ba37357: Updated to support new `ServiceFactory` formats.
- de3347ca74: Updated usages of `ServiceFactory`.
- Updated dependencies
  - @backstage/backend-app-api@0.2.1
  - @backstage/backend-plugin-api@0.1.2

## 0.1.1-next.1

### Patch Changes

- 854ba37357: Updated to support new `ServiceFactory` formats.
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.2-next.2
  - @backstage/backend-app-api@0.2.1-next.2

## 0.1.1-next.0

### Patch Changes

- de3347ca74: Updated usages of `ServiceFactory`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.2-next.0
  - @backstage/backend-app-api@0.2.1-next.0

## 0.1.0

### Minor Changes

- 5df230d48c: Introduced a new `backend-defaults` package carrying `createBackend` which was previously exported from `backend-app-api`.
  The `backend-app-api` package now exports the `createSpecializedBacked` that does not add any service factories by default.

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.2.0
  - @backstage/backend-plugin-api@0.1.1
