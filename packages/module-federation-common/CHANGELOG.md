# @backstage/module-federation-common

## 0.1.3

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.0
  - @backstage/config@1.3.7

## 0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.0-next.0
  - @backstage/config@1.3.7-next.0

## 0.1.2

### Patch Changes

- 0cb5646: Fixed the `@mui/material/styles` shared dependency key by removing a trailing slash that caused module resolution failures with MUI package exports.

## 0.1.2-next.0

### Patch Changes

- 0cb5646: Fixed the `@mui/material/styles` shared dependency key by removing a trailing slash that caused module resolution failures with MUI package exports.
- Updated dependencies
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2

## 0.1.0

### Minor Changes

- ce12dec: Added new `@backstage/module-federation-common` package that provides shared types, default configurations, and runtime utilities for module federation. It includes `loadModuleFederationHostShared` for loading shared dependencies in parallel at runtime, `defaultHostSharedDependencies` and `defaultRemoteSharedDependencies` for consistent dependency configuration, and types such as `HostSharedDependencies`, `RemoteSharedDependencies`, and `RuntimeSharedDependenciesGlobal`.
