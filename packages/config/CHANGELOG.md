# @backstage/config

## 1.1.0

### Minor Changes

- 62f448edb0b5: Added a `readDurationFromConfig` function

### Patch Changes

- 406b786a2a2c: Mark package as being free of side effects, allowing more optimized Webpack builds.
- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/errors@1.2.2
  - @backstage/types@1.1.1

## 1.1.0-next.2

### Patch Changes

- 406b786a2a2c: Mark package as being free of side effects, allowing more optimized Webpack builds.
- Updated dependencies
  - @backstage/errors@1.2.2-next.0
  - @backstage/types@1.1.1-next.0

## 1.1.0-next.1

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 1.1.0-next.0

### Minor Changes

- 62f448edb0b5: Added a `readDurationFromConfig` function

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 1.0.8

### Patch Changes

- Updated dependencies
  - @backstage/types@1.1.0

## 1.0.7

### Patch Changes

- 482dae5de1c: Updated link to docs.
- Updated dependencies
  - @backstage/types@1.0.2

## 1.0.7-next.0

### Patch Changes

- 482dae5de1c: Updated link to docs.
- Updated dependencies
  - @backstage/types@1.0.2

## 1.0.6

### Patch Changes

- ba2d69ee17: Adds the ability to coerce values to their boolean representatives.
  Values such as `"true"` `1` `on` and `y` will become `true` when using `getBoolean` and the opposites `false`.
  This happens particularly when such parameters are used with environmental substitution as environment variables are always strings.
- Updated dependencies
  - @backstage/types@1.0.2

## 1.0.6-next.0

### Patch Changes

- ba2d69ee17: Adds the ability to coerce values to their boolean representatives.
  Values such as `"true"` `1` `on` and `y` will become `true` when using `getBoolean` and the opposites `false`.
  This happens particularly when such parameters are used with environmental substitution as environment variables are always strings.
- Updated dependencies
  - @backstage/types@1.0.2

## 1.0.5

### Patch Changes

- Updated dependencies
  - @backstage/types@1.0.2

## 1.0.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/types@1.0.2-next.1

## 1.0.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/types@1.0.2-next.0

## 1.0.4

### Patch Changes

- Updated dependencies
  - @backstage/types@1.0.1

## 1.0.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/types@1.0.1-next.0

## 1.0.3

### Patch Changes

- Updated dependencies
  - @backstage/types@1.0.0

## 1.0.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/types@1.0.0

## 1.0.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/types@1.0.0

## 1.0.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/types@1.0.0

## 1.0.2

### Patch Changes

- 7d47def9c4: Removed dependency on `@types/jest`.

## 1.0.2-next.0

### Patch Changes

- 7d47def9c4: Removed dependency on `@types/jest`.

## 1.0.1

### Patch Changes

- 6e830352d4: Updated dependency `@types/node` to `^16.0.0`.

## 1.0.1-next.0

### Patch Changes

- 6e830352d4: Updated dependency `@types/node` to `^16.0.0`.

## 1.0.0

### Major Changes

- b58c70c223: This package has been promoted to v1.0! To understand how this change affects the package, please check out our [versioning policy](https://backstage.io/docs/overview/versioning-policy).

### Patch Changes

- Updated dependencies
  - @backstage/types@1.0.0

## 0.1.15

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/types@0.1.3

## 0.1.14

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/types@0.1.2

## 0.1.13

### Patch Changes

- f685e1398f: Loading of app configurations now reference the `@deprecated` construct from
  JSDoc to determine if a property in-use has been deprecated. Users are notified
  of deprecated keys in the format:

  ```txt
  The configuration key 'catalog.processors.githubOrg' of app-config.yaml is deprecated and may be removed soon. Configure a GitHub integration instead.
  ```

  When the `withDeprecatedKeys` option is set to `true` in the `process` method
  of `loadConfigSchema`, the user will be notified that deprecated keys have been
  identified in their app configuration.

  The `backend-common` and `plugin-app-backend` packages have been updated to set
  `withDeprecatedKeys` to true so that users are notified of deprecated settings
  by default.

## 0.1.13-next.0

### Patch Changes

- f685e1398f: Loading of app configurations now reference the `@deprecated` construct from
  JSDoc to determine if a property in-use has been deprecated. Users are notified
  of deprecated keys in the format:

  ```txt
  The configuration key 'catalog.processors.githubOrg' of app-config.yaml is deprecated and may be removed soon. Configure a GitHub integration instead.
  ```

  When the `withDeprecatedKeys` option is set to `true` in the `process` method
  of `loadConfigSchema`, the user will be notified that deprecated keys have been
  identified in their app configuration.

  The `backend-common` and `plugin-app-backend` packages have been updated to set
  `withDeprecatedKeys` to true so that users are notified of deprecated settings
  by default.

## 0.1.12

### Patch Changes

- f5343e7c1a: The `ConfigReader#get` method now always returns a deep clone of the configuration data.

## 0.1.11

### Patch Changes

- 10d267a1b7: Minor exports cleanup
- 41c49884d2: Start using the new `@backstage/types` package. Initially, this means using the `Observable` and `Json*` types from there. The types also remain in their old places but deprecated, and will be removed in a future release.
- 925a967f36: Replace usage of test-utils-core with test-utils

## 0.1.10

### Patch Changes

- febddedcb2: Bump `lodash` to remediate `SNYK-JS-LODASH-590103` security vulnerability

## 0.1.9

### Patch Changes

- f88b2c7db: Documented `Config` interface and mark types as public.

## 0.1.8

### Patch Changes

- 47113f1f1: Only warn once per key when trying to read visibility-filtered values

## 0.1.7

### Patch Changes

- 90f25476a: Extended the `Config` interface to have an optional `subscribe` method that can be used be notified of updates to the configuration.

## 0.1.6

### Patch Changes

- e9d3983ee: Add warning when trying to access configuration values that have been filtered out by visibility.

## 0.1.5

### Patch Changes

- d8b81fd28: Bump `json-schema` dependency from `0.2.5` to `0.3.0`.

## 0.1.4

### Patch Changes

- 0434853a5: Reformulate the json types to break type recursion

## 0.1.3

### Patch Changes

- a1f5e6545: Adds an optional type to `config.get` & `config.getOptional`. This avoids the need for casting. For example:

  ```ts
  const config = useApi(configApiRef);

  const myConfig = config.get<SomeTypeDefinition>('myPlugin.complexConfig');
  // vs
  const myConfig config.get('myPlugin.complexConfig') as SomeTypeDefinition;
  ```

## 0.1.2

### Patch Changes

- e3bd9fc2f: Fix unneeded defensive code
- e3bd9fc2f: Fix useless conditional
