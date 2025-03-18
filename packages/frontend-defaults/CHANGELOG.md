# @backstage/frontend-defaults

## 0.2.0

### Minor Changes

- 4823831: Introduced a `createFrontendFeatureLoader()` function, as well as a `FrontendFeatureLoader` interface, to gather several frontend plugins, modules or feature loaders in a single exported entrypoint and load them, possibly asynchronously. This new feature, very similar to the `createBackendFeatureLoader()` already available on the backend, supersedes the previous `CreateAppFeatureLoader` type which has been deprecated.
- 8250ffe: **BREAKING**: Dropped support for the removed opaque `@backstage/ExtensionOverrides` and `@backstage/BackstagePlugin` types.

### Patch Changes

- 4d18b55: It's now possible to provide a middleware that wraps all extension factories by passing an `extensionFactoryMiddleware` to either `createApp()` or `createSpecializedApp()`.
- abcdf44: Internal refactor to match updated `createSpecializedApp`.
- e3f19db: Feature discovery and resolution logic used in `createApp` is now exposed via the `discoverAvailableFeatures` and `resolveAsyncFeatures` functions respectively.
- Updated dependencies
  - @backstage/frontend-app-api@0.11.0
  - @backstage/frontend-plugin-api@0.10.0
  - @backstage/plugin-app@0.1.7
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## 0.2.0-next.2

### Minor Changes

- 8250ffe: **BREAKING**: Dropped support for the removed opaque `@backstage/ExtensionOverrides` and `@backstage/BackstagePlugin` types.

### Patch Changes

- 4d18b55: It's now possible to provide a middleware that wraps all extension factories by passing an `extensionFactoryMiddleware` to either `createApp()` or `createSpecializedApp()`.
- abcdf44: Internal refactor to match updated `createSpecializedApp`.
- e3f19db: Feature discovery and resolution logic used in `createApp` is now exposed via the `discoverAvailableFeatures` and `resolveAsyncFeatures` functions respectively.
- Updated dependencies
  - @backstage/frontend-app-api@0.11.0-next.2
  - @backstage/frontend-plugin-api@0.10.0-next.2
  - @backstage/plugin-app@0.1.7-next.2
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## 0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-app@0.1.7-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/frontend-app-api@0.10.6-next.1
  - @backstage/frontend-plugin-api@0.9.6-next.1

## 0.1.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.9.6-next.0
  - @backstage/frontend-app-api@0.10.6-next.0
  - @backstage/plugin-app@0.1.7-next.0

## 0.1.6

### Patch Changes

- 58ec9e7: Removed older versions of React packages as a preparatory step for upgrading to React 19. This commit does not introduce any functional changes, but removes dependencies on previous React versions, allowing for a cleaner upgrade path in subsequent commits.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.9.5
  - @backstage/frontend-app-api@0.10.5
  - @backstage/plugin-app@0.1.6
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## 0.1.6-next.3

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.9.5-next.3
  - @backstage/frontend-app-api@0.10.5-next.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-app@0.1.6-next.3

## 0.1.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/frontend-app-api@0.10.5-next.2
  - @backstage/frontend-plugin-api@0.9.5-next.2
  - @backstage/plugin-app@0.1.6-next.2

## 0.1.6-next.1

### Patch Changes

- 58ec9e7: Removed older versions of React packages as a preparatory step for upgrading to React 19. This commit does not introduce any functional changes, but removes dependencies on previous React versions, allowing for a cleaner upgrade path in subsequent commits.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.9.5-next.1
  - @backstage/frontend-app-api@0.10.5-next.1
  - @backstage/plugin-app@0.1.6-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## 0.1.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.9.5-next.0
  - @backstage/frontend-app-api@0.10.5-next.0
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-app@0.1.6-next.0

## 0.1.5

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.9.4
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/frontend-app-api@0.10.4
  - @backstage/plugin-app@0.1.5

## 0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.9.4-next.0
  - @backstage/frontend-app-api@0.10.4-next.0
  - @backstage/plugin-app@0.1.5-next.0
  - @backstage/config@1.3.2-next.0
  - @backstage/errors@1.2.7-next.0

## 0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/plugin-app@0.1.4
  - @backstage/frontend-plugin-api@0.9.3
  - @backstage/errors@1.2.6
  - @backstage/config@1.3.1
  - @backstage/frontend-app-api@0.10.3

## 0.1.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.6-next.0
  - @backstage/config@1.3.1-next.0
  - @backstage/frontend-app-api@0.10.3-next.2
  - @backstage/frontend-plugin-api@0.9.3-next.2
  - @backstage/plugin-app@0.1.4-next.2

## 0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/frontend-app-api@0.10.3-next.1
  - @backstage/frontend-plugin-api@0.9.3-next.1
  - @backstage/plugin-app@0.1.4-next.1

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-app@0.1.4-next.0
  - @backstage/frontend-plugin-api@0.9.3-next.0
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/frontend-app-api@0.10.3-next.0

## 0.1.2

### Patch Changes

- 44b82da: The default config loader no longer requires `process.env.APP_CONFIG` to be set, allowing config to be read from other sources instead.
- Updated dependencies
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/frontend-app-api@0.10.1
  - @backstage/frontend-plugin-api@0.9.1
  - @backstage/plugin-app@0.1.2

## 0.1.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/frontend-app-api@0.10.1-next.2
  - @backstage/frontend-plugin-api@0.9.1-next.2
  - @backstage/plugin-app@0.1.2-next.2

## 0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/frontend-app-api@0.10.1-next.1
  - @backstage/frontend-plugin-api@0.9.1-next.1
  - @backstage/plugin-app@0.1.2-next.1

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/frontend-app-api@0.10.1-next.0
  - @backstage/frontend-plugin-api@0.9.1-next.0
  - @backstage/plugin-app@0.1.2-next.0

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.9.0
  - @backstage/frontend-app-api@0.10.0
  - @backstage/plugin-app@0.1.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/frontend-app-api@0.10.0-next.2
  - @backstage/frontend-plugin-api@0.9.0-next.2
  - @backstage/plugin-app@0.1.1-next.2

## 0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.9.0-next.1
  - @backstage/frontend-app-api@0.10.0-next.1
  - @backstage/plugin-app@0.1.1-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.9.0-next.0
  - @backstage/frontend-app-api@0.10.0-next.0
  - @backstage/plugin-app@0.1.1-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.0

### Minor Changes

- 7c80650: Initial release of this package, which provides a default app setup through the `createApp` function. This replaces the existing `createApp` method from `@backstage/frontend-app-api`.

### Patch Changes

- 7d19cd5: Added a new `CreateAppOptions` type for the `createApp` options.
- 7d19cd5: Added `createPublicSignInApp`, used to creating apps for the public entry point.
- 836127c: Updated dependency `@testing-library/react` to `^16.0.0`.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.8.0
  - @backstage/frontend-app-api@0.9.0
  - @backstage/plugin-app@0.1.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.0-next.1

### Patch Changes

- 836127c: Updated dependency `@testing-library/react` to `^16.0.0`.
- Updated dependencies
  - @backstage/plugin-app@0.1.0-next.2
  - @backstage/frontend-app-api@0.9.0-next.2
  - @backstage/frontend-plugin-api@0.8.0-next.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.0-next.0

### Minor Changes

- 7c80650: Initial release of this package, which provides a default app setup through the `createApp` function. This replaces the existing `createApp` method from `@backstage/frontend-app-api`.

### Patch Changes

- 7d19cd5: Added a new `CreateAppOptions` type for the `createApp` options.
- 7d19cd5: Added `createPublicSignInApp`, used to creating apps for the public entry point.
- Updated dependencies
  - @backstage/frontend-app-api@0.9.0-next.1
  - @backstage/frontend-plugin-api@0.8.0-next.1
  - @backstage/plugin-app@0.1.0-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
