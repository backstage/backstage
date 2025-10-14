# @backstage/frontend-defaults

## 0.3.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.2
  - @backstage/plugin-app@0.3.1
  - @backstage/frontend-plugin-api@0.12.1
  - @backstage/config@1.3.5
  - @backstage/frontend-app-api@0.13.1

## 0.3.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.4-next.0
  - @backstage/core-components@0.18.2-next.1
  - @backstage/frontend-app-api@0.13.1-next.1
  - @backstage/frontend-plugin-api@0.12.1-next.1
  - @backstage/plugin-app@0.3.1-next.1

## 0.3.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.2-next.0
  - @backstage/frontend-plugin-api@0.12.1-next.0
  - @backstage/plugin-app@0.3.1-next.0
  - @backstage/config@1.3.3
  - @backstage/errors@1.2.7
  - @backstage/frontend-app-api@0.13.1-next.0

## 0.3.1

### Patch Changes

- 6516c3d: The default app now leverages the new error reporting functionality from `@backstage/frontend-app-api`. If there are critical errors during startup, an error screen that shows a summary of all errors will now be shown, rather than leaving the screen blank. Other errors will be logged as warnings in the console.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.12.0
  - @backstage/plugin-app@0.3.0
  - @backstage/core-components@0.18.0
  - @backstage/frontend-app-api@0.13.0

## 0.3.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.11.1-next.0
  - @backstage/core-components@0.17.6-next.0
  - @backstage/frontend-app-api@0.12.1-next.0
  - @backstage/plugin-app@0.2.1-next.0

## 0.3.0

### Minor Changes

- 76832a9: **BREAKING**: Removed the deprecated `CreateAppFeatureLoader` and support for it in other APIs. Switch existing usage to use the newer `createFrontendFeatureLoader` from `@backstage/frontend-plugin-api` instead.
- 5e12252: **BREAKING**: Restructured some of option fields of `createApp` and `createSpecializedApp`.

  - For `createApp`, all option fields _except_ `features` and `bindRoutes` have been moved into a new `advanced` object field.
  - For `createSpecializedApp`, all option fields _except_ `features`, `config`, and `bindRoutes` have been moved into a new `advanced` object field.

  This helps highlight that some options are meant to rarely be needed or used, and simplifies the usage of those options that are almost always required.

  As an example, if you used to supply a custom config loader, you would update your code as follows:

  ```diff
   createApp({
     features: [...],
  -  configLoader: new MyCustomLoader(),
  +  advanced: {
  +    configLoader: new MyCustomLoader(),
  +  },
   })
  ```

### Patch Changes

- 22de964: Deprecated `createPublicSignInApp`, which has been replaced by the new `appModulePublicSignIn` from `@backstage/plugin-app/alpha` instead.
- e4ddf22: Internal update to align with new blueprint parameter naming in the new frontend system.
- 8b1bf6e: Deprecated new frontend system config setting `app.experimental.packages` to just `app.packages`. The old config will continue working for the time being, but may be removed in a future release.
- 7adc846: Added support for passing through `allowUnknownExtensionConfig` as a flag
- e5a0a99: **BREAKING**: The `loadingComponent` option has been renamed to `loadingElement`, which is now found under `advanced.loadingElement`. The default loading element has also been switched to `<Progress />` from `@backstage/core-components`. This is of course an improvement over the previous `"Loading..."` text, but also helps prevent flicker when the app loading is fast.
- Updated dependencies
  - @backstage/core-components@0.17.5
  - @backstage/frontend-plugin-api@0.11.0
  - @backstage/frontend-app-api@0.12.0
  - @backstage/plugin-app@0.2.0

## 0.3.0-next.3

### Minor Changes

- 5e12252: **BREAKING**: Restructured some of option fields of `createApp` and `createSpecializedApp`.

  - For `createApp`, all option fields _except_ `features` and `bindRoutes` have been moved into a new `advanced` object field.
  - For `createSpecializedApp`, all option fields _except_ `features`, `config`, and `bindRoutes` have been moved into a new `advanced` object field.

  This helps highlight that some options are meant to rarely be needed or used, and simplifies the usage of those options that are almost always required.

  As an example, if you used to supply a custom config loader, you would update your code as follows:

  ```diff
   createApp({
     features: [...],
  -  configLoader: new MyCustomLoader(),
  +  advanced: {
  +    configLoader: new MyCustomLoader(),
  +  },
   })
  ```

### Patch Changes

- 8b1bf6e: Deprecated new frontend system config setting `app.experimental.packages` to just `app.packages`. The old config will continue working for the time being, but may be removed in a future release.
- e5a0a99: **BREAKING**: The `loadingComponent` option has been renamed to `loadingElement`, which is now found under `advanced.loadingElement`. The default loading element has also been switched to `<Progress />` from `@backstage/core-components`. This is of course an improvement over the previous `"Loading..."` text, but also helps prevent flicker when the app loading is fast.
- Updated dependencies
  - @backstage/plugin-app@0.2.0-next.2
  - @backstage/frontend-plugin-api@0.11.0-next.2
  - @backstage/frontend-app-api@0.12.0-next.3
  - @backstage/core-components@0.17.5-next.2

## 0.3.0-next.2

### Minor Changes

- 76832a9: **BREAKING**: Removed the deprecated `CreateAppFeatureLoader` and support for it in other APIs. Switch existing usage to use the newer `createFrontendFeatureLoader` from `@backstage/frontend-plugin-api` instead.

### Patch Changes

- 22de964: Deprecated `createPublicSignInApp`, which has been replaced by the new `appModulePublicSignIn` from `@backstage/plugin-app/alpha` instead.
- e4ddf22: Internal update to align with new blueprint parameter naming in the new frontend system.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.11.0-next.1
  - @backstage/frontend-app-api@0.12.0-next.2
  - @backstage/plugin-app@0.2.0-next.1
  - @backstage/config@1.3.3
  - @backstage/errors@1.2.7

## 0.2.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/frontend-app-api@0.11.5-next.1
  - @backstage/plugin-app@0.2.0-next.0
  - @backstage/frontend-plugin-api@0.11.0-next.0
  - @backstage/config@1.3.3
  - @backstage/errors@1.2.7

## 0.2.5-next.0

### Patch Changes

- 7adc846: Added support for passing through `allowUnknownExtensionConfig` as a flag
- Updated dependencies
  - @backstage/frontend-app-api@0.11.5-next.0
  - @backstage/plugin-app@0.1.11
  - @backstage/frontend-plugin-api@0.10.4

## 0.2.4

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.3
  - @backstage/frontend-app-api@0.11.4
  - @backstage/plugin-app@0.1.11
  - @backstage/frontend-plugin-api@0.10.4

## 0.2.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.3-next.0
  - @backstage/frontend-app-api@0.11.4-next.1
  - @backstage/frontend-plugin-api@0.10.4-next.1
  - @backstage/plugin-app@0.1.11-next.1

## 0.2.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-app@0.1.11-next.0
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/frontend-app-api@0.11.4-next.0
  - @backstage/frontend-plugin-api@0.10.4-next.0

## 0.2.3

### Patch Changes

- fa5650c: Forwarded the new `pluginInfoResolver` option for `createApp`.
- Updated dependencies
  - @backstage/plugin-app@0.1.10
  - @backstage/frontend-plugin-api@0.10.3
  - @backstage/frontend-app-api@0.11.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## 0.2.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.10.3-next.1
  - @backstage/plugin-app@0.1.10-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/frontend-app-api@0.11.3-next.1

## 0.2.3-next.0

### Patch Changes

- fa5650c: Forwarded the new `pluginInfoResolver` option for `createApp`.
- Updated dependencies
  - @backstage/plugin-app@0.1.10-next.0
  - @backstage/frontend-plugin-api@0.10.3-next.0
  - @backstage/frontend-app-api@0.11.3-next.0

## 0.2.2

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.10.2
  - @backstage/frontend-app-api@0.11.2
  - @backstage/plugin-app@0.1.9
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## 0.2.2-next.3

### Patch Changes

- Updated dependencies
  - @backstage/frontend-app-api@0.11.2-next.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/frontend-plugin-api@0.10.2-next.1
  - @backstage/plugin-app@0.1.9-next.3

## 0.2.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.2
  - @backstage/frontend-app-api@0.11.2-next.2
  - @backstage/frontend-plugin-api@0.10.2-next.1
  - @backstage/plugin-app@0.1.9-next.2
  - @backstage/errors@1.2.7

## 0.2.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.10.2-next.0
  - @backstage/plugin-app@0.1.9-next.1
  - @backstage/frontend-app-api@0.11.2-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## 0.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/frontend-app-api@0.11.2-next.0
  - @backstage/frontend-plugin-api@0.10.1
  - @backstage/plugin-app@0.1.9-next.0

## 0.2.1

### Patch Changes

- a47fd39: Removes instances of default React imports, a necessary update for the upcoming React 19 migration.

  <https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html>

- 3bee3c3: The new package `frontend-dynamic-features-loader` provides a frontend feature loader that dynamically
  loads frontend features based on the new frontend system and exposed as module federation remotes.
  This new frontend feature loader works hand-in-hand with a new server of frontend plugin module federation
  remotes, which is added as part of backend dynamic feature service in package `@backstage/backend-dynamic-feature-service`.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.10.1
  - @backstage/frontend-app-api@0.11.1
  - @backstage/plugin-app@0.1.8
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## 0.2.1-next.1

### Patch Changes

- a47fd39: Removes instances of default React imports, a necessary update for the upcoming React 19 migration.

  <https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html>

- Updated dependencies
  - @backstage/frontend-plugin-api@0.10.1-next.1
  - @backstage/frontend-app-api@0.11.1-next.1
  - @backstage/plugin-app@0.1.8-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## 0.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.10.1-next.0
  - @backstage/plugin-app@0.1.8-next.0
  - @backstage/frontend-app-api@0.11.1-next.0
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

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
