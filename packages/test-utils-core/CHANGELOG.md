# @backstage/test-utils-core

## 0.1.4

### Patch Changes

- bb12aae352: Migrates all utility methods from `test-utils-core` into `test-utils` and delete exports from the old package.
  This should have no impact since this package is considered internal and have no usages outside core packages.

  Notable changes are that the testing tool `msw.setupDefaultHandlers()` have been deprecated in favour of `setupRequestMockHandlers()`.

## 0.1.3

### Patch Changes

- ca0559444c: Avoid usage of `.to*Case()`, preferring `.toLocale*Case('en-US')` instead.

## 0.1.2

### Patch Changes

- 56c773909: Switched `@types/react` dependency to request `*` rather than a specific version.
