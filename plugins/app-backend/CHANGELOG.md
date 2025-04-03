# @backstage/plugin-app-backend

## 0.5.0

### Minor Changes

- 32be48c: **BREAKING**: Removed support for the old backend system.

  As part of this change the plugin export from `/alpha` as been removed. If you are currently importing `@backstage/plugin-app-backend/alpha`, please update your import to `@backstage/plugin-app-backend`.

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.10.0
  - @backstage/plugin-auth-node@0.6.1
  - @backstage/plugin-app-node@0.1.31
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## 0.5.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.10.0-next.0
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-app-node@0.1.31-next.2
  - @backstage/plugin-auth-node@0.6.1-next.1

## 0.5.0-next.1

### Minor Changes

- 32be48c: **BREAKING**: Removed support for the old backend system.

  As part of this change the plugin export from `/alpha` as been removed. If you are currently importing `@backstage/plugin-app-backend/alpha`, please update your import to `@backstage/plugin-app-backend`.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.1-next.1
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/config@1.3.2
  - @backstage/config-loader@1.9.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-app-node@0.1.31-next.1

## 0.4.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.1-next.0
  - @backstage/backend-plugin-api@1.2.1-next.0
  - @backstage/config-loader@1.9.6
  - @backstage/plugin-app-node@0.1.31-next.0

## 0.4.5

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.9.6
  - @backstage/backend-plugin-api@1.2.0
  - @backstage/plugin-auth-node@0.6.0
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-app-node@0.1.30

## 0.4.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.2
  - @backstage/config-loader@1.9.6-next.0
  - @backstage/plugin-auth-node@0.6.0-next.2
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-app-node@0.1.30-next.2

## 0.4.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.1
  - @backstage/plugin-auth-node@0.6.0-next.1
  - @backstage/config@1.3.2
  - @backstage/config-loader@1.9.6-next.0
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-app-node@0.1.30-next.1

## 0.4.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.9.6-next.0
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-app-node@0.1.30-next.0
  - @backstage/plugin-auth-node@0.5.7-next.0

## 0.4.4

### Patch Changes

- d9d62ef: Remove some internal usages of the backend-common package
- 8379bf4: Remove usages of `PluginDatabaseManager` and `PluginEndpointDiscovery` and replace with their equivalent service types
- Updated dependencies
  - @backstage/types@1.2.1
  - @backstage/config-loader@1.9.5
  - @backstage/plugin-auth-node@0.5.6
  - @backstage/backend-plugin-api@1.1.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-app-node@0.1.29

## 0.4.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/types@1.2.1-next.0
  - @backstage/backend-plugin-api@1.1.1-next.1
  - @backstage/config@1.3.2-next.0
  - @backstage/config-loader@1.9.5-next.1
  - @backstage/errors@1.2.7-next.0
  - @backstage/plugin-auth-node@0.5.6-next.1
  - @backstage/plugin-app-node@0.1.29-next.1

## 0.4.4-next.0

### Patch Changes

- d9d62ef: Remove some internal usages of the backend-common package
- 8379bf4: Remove usages of `PluginDatabaseManager` and `PluginEndpointDiscovery` and replace with their equivalent service types
- Updated dependencies
  - @backstage/config-loader@1.9.5-next.0
  - @backstage/plugin-auth-node@0.5.6-next.0
  - @backstage/backend-plugin-api@1.1.1-next.0
  - @backstage/config@1.3.1
  - @backstage/errors@1.2.6
  - @backstage/types@1.2.0
  - @backstage/plugin-app-node@0.1.29-next.0

## 0.4.3

### Patch Changes

- 74c3f2a: Fixed a bug where config would not be injected on the `/` and `/index.html` paths.
- 5c9cc05: Use native fetch instead of node-fetch
- d66fa80: Fix root route handling when query parameters are present
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.5
  - @backstage/backend-plugin-api@1.1.0
  - @backstage/config-loader@1.9.3
  - @backstage/errors@1.2.6
  - @backstage/config@1.3.1
  - @backstage/types@1.2.0
  - @backstage/plugin-app-node@0.1.28

## 0.4.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0-next.2
  - @backstage/errors@1.2.6-next.0
  - @backstage/plugin-app-node@0.1.28-next.2
  - @backstage/plugin-auth-node@0.5.5-next.2
  - @backstage/config-loader@1.9.3-next.1
  - @backstage/config@1.3.1-next.0
  - @backstage/types@1.2.0

## 0.4.3-next.1

### Patch Changes

- 5c9cc05: Use native fetch instead of node-fetch
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.5-next.1
  - @backstage/config-loader@1.9.3-next.0
  - @backstage/backend-plugin-api@1.1.0-next.1
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/types@1.2.0
  - @backstage/plugin-app-node@0.1.28-next.1

## 0.4.3-next.0

### Patch Changes

- 74c3f2a: Fixed a bug where config would not be injected on the `/` and `/index.html` paths.
- d66fa80: Fix root route handling when query parameters are present
- Updated dependencies
  - @backstage/backend-plugin-api@1.0.3-next.0
  - @backstage/plugin-auth-node@0.5.5-next.0
  - @backstage/config@1.3.0
  - @backstage/config-loader@1.9.2
  - @backstage/errors@1.2.5
  - @backstage/types@1.2.0
  - @backstage/plugin-app-node@0.1.28-next.0

## 0.4.0

### Minor Changes

- 815b702: Configuration is no longer injected into static assets if a `index.html.tmpl` file is present.

### Patch Changes

- 815b702: The `index.html` templating is now done and served from memory rather than written to the filesystem. This means that you can now use config injection with a read-only filesystem, and you no longer need to use the `app.disableConfigInjection` flag.
- Updated dependencies
  - @backstage/config@1.3.0
  - @backstage/types@1.2.0
  - @backstage/config-loader@1.9.2
  - @backstage/plugin-auth-node@0.5.4
  - @backstage/backend-plugin-api@1.0.2
  - @backstage/errors@1.2.5
  - @backstage/plugin-app-node@0.1.27

## 0.3.77-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.4-next.2
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.9.2-next.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.27-next.2

## 0.3.77-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.1
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.9.2-next.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.27-next.1
  - @backstage/plugin-auth-node@0.5.4-next.1

## 0.3.77-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.4-next.0
  - @backstage/backend-plugin-api@1.0.2-next.0
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.9.1
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.27-next.0

## 0.3.76

### Patch Changes

- 2c4ee26: Fixed unexpected behaviour where configuration supplied with `APP_CONFIG_*` environment variables where not filtered by the configuration schema.
- 094eaa3: Remove references to in-repo backend-common
- 3109c24: The export for the new backend system at the `/alpha` export is now also available via the main entry point, which means that you can remove the `/alpha` suffix from the import.
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3
  - @backstage/backend-plugin-api@1.0.1
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.9.1
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.26

## 0.3.76-next.1

### Patch Changes

- 2c4ee26: Fixed unexpected behaviour where configuration supplied with `APP_CONFIG_*` environment variables where not filtered by the configuration schema.
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.9.1
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.26-next.1

## 0.3.75-next.0

### Patch Changes

- 094eaa3: Remove references to in-repo backend-common
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.9.1
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.26-next.0

## 0.3.74

### Patch Changes

- 72a8c7b: Return HTTP status 400 rather than 500 when receiving an unknown POST request.
- d3f79d1: Fixing dependency metadata with the new `@backstage/plugin-app` package
- 590fb2d: **BREAKING**: The app backend now supports the new `index.html.tmpl` output from `@backstage/cli`. If available, the `index.html` will be templated at runtime with the current configuration of the app backend.

  This is marked as a breaking change because you must now supply the app build-time configuration to the backend. This change also affects the public path behavior, where it is no longer necessary to build the app with the correct public path upfront. You now only need to supply a correct `app.baseUrl` to the app backend plugin at runtime.

  An effect that this change has is that the `index.html` will now contain and present the frontend configuration in an easily readable way, which can aid in debugging. This data was always available in the frontend, but it was injected and hidden in the static bundle.

  This templating behavior is enabled by default, but it can be disabled by setting the `app.disableConfigInjection` configuration option to `true`.

- d425fc4: Modules, plugins, and services are now `BackendFeature`, not a function that returns a feature.
- c2b63ab: Updated dependency `supertest` to `^7.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.25.0
  - @backstage/backend-plugin-api@1.0.0
  - @backstage/plugin-auth-node@0.5.2
  - @backstage/plugin-app-node@0.1.25
  - @backstage/config-loader@1.9.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.3.74-next.2

### Patch Changes

- 590fb2d: **BREAKING**: The app backend now supports the new `index.html.tmpl` output from `@backstage/cli`. If available, the `index.html` will be templated at runtime with the current configuration of the app backend.

  This is marked as a breaking change because you must now supply the app build-time configuration to the backend. This change also affects the public path behavior, where it is no longer necessary to build the app with the correct public path upfront. You now only need to supply a correct `app.baseUrl` to the app backend plugin at runtime.

  An effect that this change has is that the `index.html` will now contain and present the frontend configuration in an easily readable way, which can aid in debugging. This data was always available in the frontend, but it was injected and hidden in the static bundle.

  This templating behavior is enabled by default, but it can be disabled by setting the `app.disableConfigInjection` configuration option to `true`.

- c2b63ab: Updated dependency `supertest` to `^7.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.25.0-next.2
  - @backstage/plugin-auth-node@0.5.2-next.2
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/config-loader@1.9.1-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.25-next.2

## 0.3.74-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.25.0-next.1
  - @backstage/plugin-auth-node@0.5.2-next.1
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.9.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.25-next.1

## 0.3.74-next.0

### Patch Changes

- d3f79d1: Fixing dependency metadata with the new `@backstage/plugin-app` package
- d425fc4: Modules, plugins, and services are now `BackendFeature`, not a function that returns a feature.
- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/plugin-app-node@0.1.25-next.0
  - @backstage/backend-common@0.25.0-next.0
  - @backstage/plugin-auth-node@0.5.2-next.0
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.9.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.3.72

### Patch Changes

- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- 6bd6fda: Deprecate `createRouter` and its options in favour of the new backend system.
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/backend-common@0.24.0
  - @backstage/config-loader@1.9.0
  - @backstage/plugin-auth-node@0.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.23

## 0.3.72-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/backend-common@0.23.4-next.3
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.9.0-next.2
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.23-next.3
  - @backstage/plugin-auth-node@0.5.0-next.3

## 0.3.72-next.2

### Patch Changes

- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/backend-common@0.23.4-next.2
  - @backstage/config-loader@1.9.0-next.2
  - @backstage/plugin-auth-node@0.5.0-next.2
  - @backstage/plugin-app-node@0.1.23-next.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.3.72-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.9.0-next.1
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/backend-common@0.23.4-next.1
  - @backstage/plugin-app-node@0.1.23-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.18-next.1

## 0.3.72-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.4-next.0
  - @backstage/config-loader@1.8.2-next.0
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.23-next.0
  - @backstage/plugin-auth-node@0.4.18-next.0

## 0.3.71

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/backend-common@0.23.3
  - @backstage/plugin-auth-node@0.4.17
  - @backstage/plugin-app-node@0.1.22
  - @backstage/config-loader@1.8.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.3.71-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.3-next.1
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.8.1
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.22-next.1
  - @backstage/plugin-auth-node@0.4.17-next.1

## 0.3.70-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/backend-common@0.23.2-next.0
  - @backstage/plugin-app-node@0.1.21-next.0
  - @backstage/plugin-auth-node@0.4.16-next.0
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.8.1
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.3.68

### Patch Changes

- 8869b8e: Updated local development setup.
- 78a0b08: Internal refactor to handle `BackendFeature` contract change.
- 82c2b90: Restore the support of external config schema in the router of the `app-backend` plugin, which was broken in release `1.26.0`.
  This support is critical for dynamic frontend plugins to have access to their config values.
- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-common@0.23.0
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/plugin-auth-node@0.4.14
  - @backstage/plugin-app-node@0.1.19
  - @backstage/config-loader@1.8.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.3.68-next.3

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/plugin-auth-node@0.4.14-next.3
  - @backstage/plugin-app-node@0.1.19-next.2
  - @backstage/backend-common@0.23.0-next.3
  - @backstage/config-loader@1.8.1-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.3.68-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/backend-common@0.23.0-next.2
  - @backstage/plugin-app-node@0.1.19-next.1
  - @backstage/plugin-auth-node@0.4.14-next.2
  - @backstage/config-loader@1.8.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.3.68-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/backend-common@0.23.0-next.1
  - @backstage/config-loader@1.8.0
  - @backstage/plugin-auth-node@0.4.14-next.1

## 0.3.68-next.0

### Patch Changes

- 8869b8e: Updated local development setup.
- 82c2b90: Restore the support of external config schema in the router of the `app-backend` plugin, which was broken in release `1.26.0`.
  This support is critical for dynamic frontend plugins to have access to their config values.
- Updated dependencies
  - @backstage/backend-common@0.22.1-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/plugin-auth-node@0.4.14-next.0
  - @backstage/plugin-app-node@0.1.19-next.0
  - @backstage/config-loader@1.8.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.3.66

### Patch Changes

- d229dc4: Move path utilities from `backend-common` to the `backend-plugin-api` package.
- Updated dependencies
  - @backstage/backend-common@0.22.0
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/plugin-auth-node@0.4.13
  - @backstage/plugin-app-node@0.1.18

## 0.3.66-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.0-next.1
  - @backstage/plugin-auth-node@0.4.13-next.1
  - @backstage/config-loader@1.8.0
  - @backstage/backend-plugin-api@0.6.18-next.1
  - @backstage/plugin-app-node@0.1.18-next.1

## 0.3.66-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.4.13-next.0
  - @backstage/backend-common@0.21.8-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.8.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.18-next.0

## 0.3.65

### Patch Changes

- d5a1fe1: Replaced winston logger with `LoggerService`
- c884b9a: Track assets namespace in the cache store, implement a cookie authentication for when the public entry is enabled and used with the new auth services.
- Updated dependencies
  - @backstage/backend-common@0.21.7
  - @backstage/config-loader@1.8.0
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/plugin-auth-node@0.4.12
  - @backstage/plugin-app-node@0.1.17
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.3.65-next.1

### Patch Changes

- c884b9a: Track assets namespace in the cache store, implement a cookie authentication for when the public entry is enabled and used with the new auth services.
- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/plugin-auth-node@0.4.12-next.1
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.8.0-next.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.17-next.1

## 0.3.65-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.0
  - @backstage/config-loader@1.8.0-next.0
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.17-next.0

## 0.3.64

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.6
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.7.0
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.16

## 0.3.63

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.5
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.7.0
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.15

## 0.3.62

### Patch Changes

- 52e43f2: Disable default auth policy, allowing unauthenticated access to app bundle.
- Updated dependencies
  - @backstage/backend-common@0.21.4
  - @backstage/config@1.2.0
  - @backstage/backend-plugin-api@0.6.14
  - @backstage/config-loader@1.7.0
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.14

## 0.3.62-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/config@1.2.0-next.1
  - @backstage/config-loader@1.7.0-next.1
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.14-next.2

## 0.3.62-next.1

### Patch Changes

- 52e43f2: Disable default auth policy, allowing unauthenticated access to app bundle.
- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/config-loader@1.7.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-app-node@0.1.14-next.1
  - @backstage/types@1.1.1

## 0.3.61-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/config-loader@1.6.3-next.0
  - @backstage/config@1.1.2-next.0
  - @backstage/plugin-app-node@0.1.13-next.0
  - @backstage/types@1.1.1

## 0.3.58

### Patch Changes

- 9aac2b0: Use `--cwd` as the first `yarn` argument
- 998ccf6: Support injecting config multiple times in a single bundle
- 6bb6f3e: Updated dependency `fs-extra` to `^11.2.0`.
  Updated dependency `@types/fs-extra` to `^11.0.0`.
- 54ad8e1: Allow the `app-backend` plugin to use a global configuration schema provided externally through an extension.
- 9dfd57d: Do not force caching of the Javascript asset that contains the injected config.
- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/config-loader@1.6.2
  - @backstage/plugin-app-node@0.1.10
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## 0.3.58-next.3

### Patch Changes

- 54ad8e1: Allow the `app-backend` plugin to use a global configuration schema provided externally through an extension.
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/config-loader@1.6.2-next.0
  - @backstage/plugin-app-node@0.1.10-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## 0.3.58-next.2

### Patch Changes

- 9aac2b0: Use `--cwd` as the first `yarn` argument
- 998ccf6: Support injecting config multiple times in a single bundle
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/plugin-app-node@0.1.10-next.2
  - @backstage/config@1.1.1
  - @backstage/config-loader@1.6.1
  - @backstage/types@1.1.1

## 0.3.58-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/config@1.1.1
  - @backstage/config-loader@1.6.1
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.10-next.1

## 0.3.58-next.0

### Patch Changes

- 9dfd57d: Do not force caching of the Javascript asset that contains the injected config.
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/config-loader@1.6.1
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.10-next.0

## 0.3.57

### Patch Changes

- 4016f21: Remove some unused dependencies
- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/config-loader@1.6.1
  - @backstage/backend-plugin-api@0.6.9
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.9

## 0.3.57-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2
  - @backstage/backend-common@0.20.1-next.2
  - @backstage/plugin-app-node@0.1.9-next.2
  - @backstage/config-loader@1.6.1-next.0

## 0.3.57-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.6.1-next.0
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/config@1.1.1
  - @backstage/backend-plugin-api@0.6.9-next.1
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.9-next.1

## 0.3.57-next.0

### Patch Changes

- 4016f21: Remove some unused dependencies
- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/backend-plugin-api@0.6.9-next.0
  - @backstage/config@1.1.1
  - @backstage/config-loader@1.6.0
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.9-next.0

## 0.3.56

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/config-loader@1.6.0
  - @backstage/backend-plugin-api@0.6.8
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.8

## 0.3.56-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/backend-plugin-api@0.6.8-next.3
  - @backstage/config@1.1.1
  - @backstage/config-loader@1.6.0-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.8-next.3

## 0.3.56-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.6.0-next.0
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/backend-plugin-api@0.6.8-next.2
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.8-next.2

## 0.3.56-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/config@1.1.1
  - @backstage/config-loader@1.5.3
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.8-next.1

## 0.3.56-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.0
  - @backstage/backend-plugin-api@0.6.8-next.0
  - @backstage/config@1.1.1
  - @backstage/config-loader@1.5.3
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.8-next.0

## 0.3.55

### Patch Changes

- 013611b42e: `knex` has been bumped to major version 3 and `better-sqlite3` to major version 9, which deprecate node 16 support.
- Updated dependencies
  - @backstage/config-loader@1.5.3
  - @backstage/backend-common@0.19.9
  - @backstage/backend-plugin-api@0.6.7
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.7

## 0.3.55-next.2

### Patch Changes

- [#20570](https://github.com/backstage/backstage/pull/20570) [`013611b42e`](https://github.com/backstage/backstage/commit/013611b42ed457fefa9bb85fddf416cf5e0c1f76) Thanks [@freben](https://github.com/freben)! - `knex` has been bumped to major version 3 and `better-sqlite3` to major version 9, which deprecate node 16 support.

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.2
  - @backstage/backend-common@0.19.9-next.2
  - @backstage/plugin-app-node@0.1.7-next.2
  - @backstage/config-loader@1.5.3-next.0

## 0.3.55-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9-next.1
  - @backstage/config-loader@1.5.3-next.0
  - @backstage/backend-plugin-api@0.6.7-next.1
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.7-next.1

## 0.3.55-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.5.2-next.0
  - @backstage/backend-common@0.19.9-next.0
  - @backstage/backend-plugin-api@0.6.7-next.0
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.7-next.0

## 0.3.54

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/config-loader@1.5.1
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.6

## 0.3.54-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8-next.2
  - @backstage/config-loader@1.5.1-next.1
  - @backstage/backend-plugin-api@0.6.6-next.2
  - @backstage/config@1.1.1-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.6-next.2

## 0.3.53-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.7-next.1
  - @backstage/backend-plugin-api@0.6.5-next.1
  - @backstage/config@1.1.0
  - @backstage/config-loader@1.5.1-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.5-next.1

## 0.3.53-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.5.1-next.0
  - @backstage/backend-common@0.19.7-next.0
  - @backstage/config@1.1.0
  - @backstage/backend-plugin-api@0.6.5-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.5-next.0

## 0.3.51

### Patch Changes

- 71114ac50e02: The export for the new backend system has been moved to be the `default` export.

  For example, if you are currently importing the plugin using the following pattern:

  ```ts
  import { examplePlugin } from '@backstage/plugin-example-backend';

  backend.add(examplePlugin);
  ```

  It should be migrated to this:

  ```ts
  backend.add(import('@backstage/plugin-example-backend'));
  ```

- cfc3ca6ce060: Changes needed to support MySQL
- Updated dependencies
  - @backstage/backend-common@0.19.5
  - @backstage/config@1.1.0
  - @backstage/types@1.1.1
  - @backstage/backend-plugin-api@0.6.3
  - @backstage/config-loader@1.5.0
  - @backstage/plugin-app-node@0.1.3

## 0.3.51-next.3

### Patch Changes

- 71114ac50e02: The export for the new backend system has been moved to be the `default` export.

  For example, if you are currently importing the plugin using the following pattern:

  ```ts
  import { examplePlugin } from '@backstage/plugin-example-backend';

  backend.add(examplePlugin);
  ```

  It should be migrated to this:

  ```ts
  backend.add(import('@backstage/plugin-example-backend'));
  ```

- Updated dependencies
  - @backstage/config@1.1.0-next.2
  - @backstage/types@1.1.1-next.0
  - @backstage/backend-plugin-api@0.6.3-next.3
  - @backstage/backend-common@0.19.5-next.3
  - @backstage/config-loader@1.5.0-next.3
  - @backstage/plugin-app-node@0.1.3-next.3

## 0.3.51-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.5.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/types@1.1.0
  - @backstage/plugin-app-node@0.1.3-next.2

## 0.3.51-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/backend-common@0.19.5-next.1
  - @backstage/backend-plugin-api@0.6.3-next.1
  - @backstage/config-loader@1.5.0-next.1
  - @backstage/plugin-app-node@0.1.3-next.1
  - @backstage/types@1.1.0

## 0.3.50-next.0

### Patch Changes

- cfc3ca6ce060: Changes needed to support MySQL
- Updated dependencies
  - @backstage/backend-common@0.19.4-next.0
  - @backstage/config-loader@1.5.0-next.0
  - @backstage/backend-plugin-api@0.6.2-next.0
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0
  - @backstage/plugin-app-node@0.1.2-next.0

## 0.3.48

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- d564ad142b17: Migrated the alpha `appBackend` export to use static configuration and extension points rather than accepting options.
- Updated dependencies
  - @backstage/backend-common@0.19.2
  - @backstage/config-loader@1.4.0
  - @backstage/backend-plugin-api@0.6.0
  - @backstage/plugin-app-node@0.1.0
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0

## 0.3.48-next.2

### Patch Changes

- d564ad142b17: Migrated the alpha `appBackend` export to use static configuration and extension points rather than accepting options.
- Updated dependencies
  - @backstage/plugin-app-node@0.1.0-next.0
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/config-loader@1.4.0-next.1

## 0.3.48-next.1

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- Updated dependencies
  - @backstage/backend-common@0.19.2-next.1
  - @backstage/config-loader@1.4.0-next.1
  - @backstage/backend-plugin-api@0.6.0-next.1
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0

## 0.3.48-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.4.0-next.0
  - @backstage/backend-common@0.19.2-next.0
  - @backstage/backend-plugin-api@0.5.5-next.0
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0

## 0.3.47

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.1
  - @backstage/backend-plugin-api@0.5.4
  - @backstage/config@1.0.8
  - @backstage/config-loader@1.3.2
  - @backstage/types@1.1.0

## 0.3.47-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/backend-plugin-api@0.5.4-next.0
  - @backstage/config@1.0.8
  - @backstage/config-loader@1.3.2-next.0
  - @backstage/types@1.1.0

## 0.3.46

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0
  - @backstage/types@1.1.0
  - @backstage/config-loader@1.3.1
  - @backstage/backend-plugin-api@0.5.3
  - @backstage/config@1.0.8

## 0.3.46-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.2
  - @backstage/backend-plugin-api@0.5.3-next.2
  - @backstage/config@1.0.7
  - @backstage/config-loader@1.3.1-next.1
  - @backstage/types@1.0.2

## 0.3.46-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.1
  - @backstage/backend-plugin-api@0.5.3-next.1
  - @backstage/config-loader@1.3.1-next.1
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.3.46-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.3.1-next.0
  - @backstage/backend-common@0.18.6-next.0
  - @backstage/config@1.0.7
  - @backstage/backend-plugin-api@0.5.3-next.0
  - @backstage/types@1.0.2

## 0.3.45

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5
  - @backstage/config-loader@1.3.0
  - @backstage/backend-plugin-api@0.5.2
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.3.45-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config-loader@1.3.0-next.0
  - @backstage/config@1.0.7

## 0.3.45-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.0
  - @backstage/config-loader@1.3.0-next.0
  - @backstage/backend-plugin-api@0.5.2-next.0
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.3.44

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4
  - @backstage/config-loader@1.2.0
  - @backstage/backend-plugin-api@0.5.1
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.3.44-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/config@1.0.7
  - @backstage/config-loader@1.1.9
  - @backstage/types@1.0.2

## 0.3.44-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.1
  - @backstage/backend-plugin-api@0.5.1-next.1
  - @backstage/config@1.0.7
  - @backstage/config-loader@1.1.9
  - @backstage/types@1.0.2

## 0.3.44-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.0
  - @backstage/config@1.0.7
  - @backstage/backend-plugin-api@0.5.1-next.0
  - @backstage/config-loader@1.1.9
  - @backstage/types@1.0.2

## 0.3.43

### Patch Changes

- 928a12a9b3e: Internal refactor of `/alpha` exports.
- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.18.3
  - @backstage/backend-plugin-api@0.5.0
  - @backstage/config-loader@1.1.9
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.3.43-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.3-next.2
  - @backstage/backend-plugin-api@0.4.1-next.2
  - @backstage/config@1.0.7-next.0

## 0.3.43-next.1

### Patch Changes

- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.18.3-next.1
  - @backstage/config-loader@1.1.9-next.0
  - @backstage/backend-plugin-api@0.4.1-next.1
  - @backstage/config@1.0.7-next.0
  - @backstage/types@1.0.2

## 0.3.43-next.0

### Patch Changes

- 928a12a9b3: Internal refactor of `/alpha` exports.
- Updated dependencies
  - @backstage/backend-plugin-api@0.4.1-next.0
  - @backstage/backend-common@0.18.3-next.0
  - @backstage/config@1.0.6
  - @backstage/config-loader@1.1.8
  - @backstage/types@1.0.2

## 0.3.42

### Patch Changes

- 0ff03319be: Updated usage of `createBackendPlugin`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.4.0
  - @backstage/backend-common@0.18.2
  - @backstage/config@1.0.6
  - @backstage/config-loader@1.1.8
  - @backstage/types@1.0.2

## 0.3.42-next.2

### Patch Changes

- 0ff03319be: Updated usage of `createBackendPlugin`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.4.0-next.2
  - @backstage/backend-common@0.18.2-next.2
  - @backstage/config@1.0.6
  - @backstage/config-loader@1.1.8
  - @backstage/types@1.0.2

## 0.3.42-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.1
  - @backstage/backend-plugin-api@0.3.2-next.1
  - @backstage/config@1.0.6
  - @backstage/config-loader@1.1.8
  - @backstage/types@1.0.2

## 0.3.42-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.0
  - @backstage/backend-plugin-api@0.3.2-next.0

## 0.3.40

### Patch Changes

- b4ffa3bd91: The warning for missing app contents is now logged as an error instead, but only in production.
- ecbec4ec4c: Internal refactor to match new options pattern in the experimental backend system.
- 8e06f3cf00: Switched imports of `loggerToWinstonLogger` to `@backstage/backend-common`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0
  - @backstage/backend-common@0.18.0
  - @backstage/config@1.0.6
  - @backstage/config-loader@1.1.8
  - @backstage/types@1.0.2

## 0.3.40-next.1

### Patch Changes

- 8e06f3cf00: Switched imports of `loggerToWinstonLogger` to `@backstage/backend-common`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0-next.1
  - @backstage/backend-common@0.18.0-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/config-loader@1.1.8-next.0
  - @backstage/types@1.0.2

## 0.3.40-next.0

### Patch Changes

- b4ffa3bd91: The warning for missing app contents is now logged as an error instead, but only in production.
- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/config-loader@1.1.8-next.0
  - @backstage/types@1.0.2

## 0.3.39

### Patch Changes

- 884d749b14: Refactored to use `coreServices` from `@backstage/backend-plugin-api`.
- 3280711113: Updated dependency `msw` to `^0.49.0`.
- Updated dependencies
  - @backstage/backend-common@0.17.0
  - @backstage/backend-plugin-api@0.2.0
  - @backstage/config-loader@1.1.7
  - @backstage/types@1.0.2
  - @backstage/config@1.0.5

## 0.3.39-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.3
  - @backstage/backend-plugin-api@0.2.0-next.3
  - @backstage/config@1.0.5-next.1
  - @backstage/config-loader@1.1.7-next.2
  - @backstage/types@1.0.2-next.1

## 0.3.39-next.2

### Patch Changes

- 884d749b14: Refactored to use `coreServices` from `@backstage/backend-plugin-api`.
- Updated dependencies
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/backend-plugin-api@0.2.0-next.2
  - @backstage/config@1.0.5-next.1
  - @backstage/config-loader@1.1.7-next.2
  - @backstage/types@1.0.2-next.1

## 0.3.39-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/config-loader@1.1.7-next.1
  - @backstage/backend-plugin-api@0.1.5-next.1
  - @backstage/config@1.0.5-next.1

## 0.3.39-next.0

### Patch Changes

- 3280711113: Updated dependency `msw` to `^0.49.0`.
- Updated dependencies
  - @backstage/backend-common@0.16.1-next.0
  - @backstage/config-loader@1.1.7-next.0
  - @backstage/types@1.0.2-next.0
  - @backstage/backend-plugin-api@0.1.5-next.0
  - @backstage/config@1.0.5-next.0

## 0.3.38

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0
  - @backstage/types@1.0.1
  - @backstage/backend-plugin-api@0.1.4
  - @backstage/config@1.0.4
  - @backstage/config-loader@1.1.6

## 0.3.38-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.1
  - @backstage/backend-plugin-api@0.1.4-next.1
  - @backstage/config@1.0.4-next.0
  - @backstage/config-loader@1.1.6-next.0
  - @backstage/types@1.0.1-next.0

## 0.3.38-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.0
  - @backstage/types@1.0.1-next.0
  - @backstage/backend-plugin-api@0.1.4-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/config-loader@1.1.6-next.0

## 0.3.37

### Patch Changes

- 11c9e0ad33: Added alpha plugin implementation for the new backend system. Available at `@backstage/plugin-app-backend/alpha`.
- Updated dependencies
  - @backstage/backend-common@0.15.2
  - @backstage/backend-plugin-api@0.1.3
  - @backstage/config@1.0.3
  - @backstage/config-loader@1.1.5
  - @backstage/types@1.0.0

## 0.3.37-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.2
  - @backstage/backend-plugin-api@0.1.3-next.2
  - @backstage/config@1.0.3-next.2
  - @backstage/config-loader@1.1.5-next.2
  - @backstage/types@1.0.0

## 0.3.37-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.1
  - @backstage/backend-plugin-api@0.1.3-next.1
  - @backstage/config@1.0.3-next.1
  - @backstage/config-loader@1.1.5-next.1
  - @backstage/types@1.0.0

## 0.3.37-next.0

### Patch Changes

- 11c9e0ad33: Added alpha plugin implementation for the new backend system. Available at `@backstage/plugin-app-backend/alpha`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.3-next.0
  - @backstage/backend-common@0.15.2-next.0
  - @backstage/config@1.0.3-next.0
  - @backstage/config-loader@1.1.5-next.0
  - @backstage/types@1.0.0

## 0.3.36

### Patch Changes

- d669d89206: Minor API signatures cleanup
- 60b85d8ade: Updated dependency `helmet` to `^6.0.0`.

  Please note that these policies are no longer applied by default:

  helmet.contentSecurityPolicy no longer sets block-all-mixed-content directive by default
  helmet.expectCt is no longer set by default. It can, however, be explicitly enabled. It will be removed in Helmet 7.

- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- 8872cc735d: Fixed a bug where the database option to skip migrations was ignored.
- Updated dependencies
  - @backstage/backend-common@0.15.1
  - @backstage/config-loader@1.1.4
  - @backstage/config@1.0.2

## 0.3.36-next.3

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.1.4-next.2
  - @backstage/config@1.0.2-next.0
  - @backstage/backend-common@0.15.1-next.3

## 0.3.36-next.2

### Patch Changes

- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.2
  - @backstage/config-loader@1.1.4-next.1

## 0.3.36-next.1

### Patch Changes

- d669d89206: Minor API signatures cleanup
- 60b85d8ade: Updated dependency `helmet` to `^6.0.0`.

  Please note that these policies are no longer applied by default:

  helmet.contentSecurityPolicy no longer sets block-all-mixed-content directive by default
  helmet.expectCt is no longer set by default. It can, however, be explicitly enabled. It will be removed in Helmet 7.

- Updated dependencies
  - @backstage/backend-common@0.15.1-next.1

## 0.3.36-next.0

### Patch Changes

- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- 8872cc735d: Fixed a bug where the database option to skip migrations was ignored.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.0
  - @backstage/config-loader@1.1.4-next.0

## 0.3.35

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0

## 0.3.35-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0-next.0

## 0.3.34

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 4e9a90e307: Updated dependency `luxon` to `^3.0.0`.
- 8006d0f9bf: Updated dependency `msw` to `^0.44.0`.
- 679b32172e: Updated dependency `knex` to `^2.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.1
  - @backstage/config-loader@1.1.3

## 0.3.34-next.3

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 4e9a90e307: Updated dependency `luxon` to `^3.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.1-next.3
  - @backstage/config-loader@1.1.3-next.1

## 0.3.34-next.2

### Patch Changes

- 679b32172e: Updated dependency `knex` to `^2.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.1-next.2

## 0.3.34-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.1
  - @backstage/config-loader@1.1.3-next.0

## 0.3.34-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.0

## 0.3.33

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.0
  - @backstage/config-loader@1.1.2

## 0.3.33-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.0-next.2

## 0.3.33-next.1

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/backend-common@0.13.6-next.1
  - @backstage/config-loader@1.1.2-next.0

## 0.3.33-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.6-next.0

## 0.3.32

### Patch Changes

- cfc0f19699: Updated dependency `fs-extra` to `10.1.0`.
- Updated dependencies
  - @backstage/backend-common@0.13.3
  - @backstage/config@1.0.1
  - @backstage/config-loader@1.1.1

## 0.3.32-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.2
  - @backstage/config@1.0.1-next.0
  - @backstage/config-loader@1.1.1-next.1

## 0.3.32-next.0

### Patch Changes

- cfc0f19699: Updated dependency `fs-extra` to `10.1.0`.
- Updated dependencies
  - @backstage/backend-common@0.13.3-next.0
  - @backstage/config-loader@1.1.1-next.0

## 0.3.31

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.1.0
  - @backstage/backend-common@0.13.2

## 0.3.31-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.2-next.2
  - @backstage/config-loader@1.1.0-next.1

## 0.3.31-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.0.1-next.0
  - @backstage/backend-common@0.13.2-next.0

## 0.3.30

### Patch Changes

- 89c7e47967: Minor README update
- Updated dependencies
  - @backstage/config-loader@1.0.0
  - @backstage/backend-common@0.13.1
  - @backstage/config@1.0.0
  - @backstage/types@1.0.0

## 0.3.29

### Patch Changes

- ab7cd7d70e: Do some groundwork for supporting the `better-sqlite3` driver, to maybe eventually replace `@vscode/sqlite3` (#9912)
- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1
- Updated dependencies
  - @backstage/backend-common@0.13.0
  - @backstage/config-loader@0.9.7

## 0.3.29-next.0

### Patch Changes

- ab7cd7d70e: Do some groundwork for supporting the `better-sqlite3` driver, to maybe eventually replace `@vscode/sqlite3` (#9912)
- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1
- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0
  - @backstage/config-loader@0.9.7-next.0

## 0.3.28

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.12.0

## 0.3.27

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.11.0
  - @backstage/config-loader@0.9.6

## 0.3.26

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/backend-common@0.10.9
  - @backstage/config@0.1.15
  - @backstage/config-loader@0.9.5
  - @backstage/types@0.1.3

## 0.3.25

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- 0107c9aa08: chore(deps): bump `helmet` from 4.4.1 to 5.0.2
- Updated dependencies
  - @backstage/backend-common@0.10.8
  - @backstage/config-loader@0.9.4
  - @backstage/config@0.1.14
  - @backstage/types@0.1.2

## 0.3.24

### Patch Changes

- 2441d1cf59: chore(deps): bump `knex` from 0.95.6 to 1.0.2

  This also replaces `sqlite3` with `@vscode/sqlite3` 5.0.7

- Updated dependencies
  - @backstage/backend-common@0.10.7

## 0.3.24-next.0

### Patch Changes

- 2441d1cf59: chore(deps): bump `knex` from 0.95.6 to 1.0.2

  This also replaces `sqlite3` with `@vscode/sqlite3` 5.0.7

- Updated dependencies
  - @backstage/backend-common@0.10.7-next.0

## 0.3.23

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6

## 0.3.23-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6-next.0

## 0.3.22

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

- eb00e8af14: Updated the cache control headers for static assets to instruct clients to cache them for 14 days.
- eb00e8af14: Added a new asset cache that stores static assets from previous deployments in the database. This fixes an issue where users have old browser tabs open and try to lazy-load static assets that no longer exist in the latest version.

  The asset cache is enabled by passing the `database` option to `createRouter`.

- Updated dependencies
  - @backstage/backend-common@0.10.4
  - @backstage/config@0.1.13
  - @backstage/config-loader@0.9.3

## 0.3.22-next.0

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

- eb00e8af14: Updated the cache control headers for static assets to instruct clients to cache them for 14 days.
- eb00e8af14: Added a new asset cache that stores static assets from previous deployments in the database. This fixes an issue where users have old browser tabs open and try to lazy-load static assets that no longer exist in the latest version.

  The asset cache is enabled by passing the `database` option to `createRouter`.

- Updated dependencies
  - @backstage/backend-common@0.10.4-next.0
  - @backstage/config@0.1.13-next.0
  - @backstage/config-loader@0.9.3-next.0

## 0.3.21

### Patch Changes

- 9d9cfc1b8a: Set `X-Frame-Options: deny` rather than the default `sameorigin` for all content served by the `app-backend`.`
- Updated dependencies
  - @backstage/backend-common@0.10.1
  - @backstage/config-loader@0.9.1

## 0.3.20

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.0
  - @backstage/config-loader@0.9.0

## 0.3.19

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@0.8.0
  - @backstage/backend-common@0.9.10

## 0.3.18

### Patch Changes

- 10615525f3: Switch to use the json and observable types from `@backstage/types`
- Updated dependencies
  - @backstage/config@0.1.11
  - @backstage/backend-common@0.9.8
  - @backstage/config-loader@0.7.1

## 0.3.17

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@0.7.0
  - @backstage/backend-common@0.9.7

## 0.3.16

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.9.0
  - @backstage/config@0.1.8

## 0.3.15

### Patch Changes

- ae84b20cf: Revert the upgrade to `fs-extra@10.0.0` as that seemed to have broken all installs inexplicably.
- Updated dependencies
  - @backstage/backend-common@0.8.6
  - @backstage/config-loader@0.6.5

## 0.3.14

### Patch Changes

- 3108ff7bf: Make `yarn dev` respect the `PLUGIN_PORT` environment variable.
- Updated dependencies
  - @backstage/backend-common@0.8.3
  - @backstage/config-loader@0.6.4

## 0.3.13

### Patch Changes

- Updated dependencies [22fd8ce2a]
- Updated dependencies [f9fb4a205]
  - @backstage/backend-common@0.8.0

## 0.3.12

### Patch Changes

- Updated dependencies [e0bfd3d44]
- Updated dependencies [38ca05168]
- Updated dependencies [d8b81fd28]
  - @backstage/backend-common@0.7.0
  - @backstage/config-loader@0.6.1
  - @backstage/config@0.1.5

## 0.3.11

### Patch Changes

- Updated dependencies [82c66b8cd]
- Updated dependencies [b779b5fee]
  - @backstage/config-loader@0.6.0
  - @backstage/backend-common@0.6.2

## 0.3.10

### Patch Changes

- Updated dependencies [8686eb38c]
- Updated dependencies [0434853a5]
- Updated dependencies [8686eb38c]
  - @backstage/backend-common@0.6.0
  - @backstage/config@0.1.4

## 0.3.9

### Patch Changes

- 393b623ae: Add a `Cache-Control: no-store, max-age=0` header to the `index.html` response to instruct the browser to not cache the pages.
  This tells the browser to not serve a cached `index.html` that might link to static assets from a previous deployment that are not available anymore.
- Updated dependencies [d7245b733]
- Updated dependencies [761698831]
  - @backstage/backend-common@0.5.6

## 0.3.8

### Patch Changes

- 1c06cb312: Clarify troubleshooting steps for schema serialization issues.
- Updated dependencies [a1f5e6545]
  - @backstage/config@0.1.3

## 0.3.7

### Patch Changes

- 727f0deec: Added a new `disableConfigInjection` option, which can be used to disable the configuration injection in environments where it can't be used.
- Updated dependencies [ffffea8e6]
- Updated dependencies [82b2c11b6]
- Updated dependencies [965e200c6]
- Updated dependencies [5a5163519]
  - @backstage/backend-common@0.5.3

## 0.3.6

### Patch Changes

- e9aab60c7: Failures to load the frontend configuration schema now throws an error that includes more context and instructions for how to fix the issue.
- Updated dependencies [2430ee7c2]
- Updated dependencies [062df71db]
- Updated dependencies [e9aab60c7]
  - @backstage/backend-common@0.5.2
  - @backstage/config-loader@0.5.1

## 0.3.5

### Patch Changes

- Updated dependencies [26a3a6cf0]
- Updated dependencies [664dd08c9]
- Updated dependencies [9dd057662]
- Updated dependencies [ef7957be4]
- Updated dependencies [ef7957be4]
- Updated dependencies [ef7957be4]
  - @backstage/backend-common@0.5.1
  - @backstage/config-loader@0.5.0

## 0.3.4

### Patch Changes

- Updated dependencies [0b135e7e0]
- Updated dependencies [294a70cab]
- Updated dependencies [0ea032763]
- Updated dependencies [5345a1f98]
- Updated dependencies [09a370426]
  - @backstage/backend-common@0.5.0

## 0.3.3

### Patch Changes

- Updated dependencies [38e24db00]
- Updated dependencies [e3bd9fc2f]
- Updated dependencies [12bbd748c]
- Updated dependencies [e3bd9fc2f]
  - @backstage/backend-common@0.4.0
  - @backstage/config@0.1.2

## 0.3.2

### Patch Changes

- Updated dependencies [4e7091759]
- Updated dependencies [b4488ddb0]
- Updated dependencies [612368274]
  - @backstage/config-loader@0.4.0
  - @backstage/backend-common@0.3.3

## 0.3.1

### Patch Changes

- ff1301d28: Warn if the app-backend can't start-up because the static directory that should be served is unavailable.
- Updated dependencies [3aa7efb3f]
- Updated dependencies [b3d4e4e57]
  - @backstage/backend-common@0.3.2

## 0.3.0

### Minor Changes

- 1722cb53c: Use new config schema support to automatically inject config with frontend visibility, in addition to the existing env schema injection.

  This removes the confusing behavior where configuration was only injected into the app at build time. Any runtime configuration (except for environment config) in the backend used to only apply to the backend itself, and not be injected into the frontend.

### Patch Changes

- Updated dependencies [1722cb53c]
- Updated dependencies [1722cb53c]
- Updated dependencies [7b37e6834]
- Updated dependencies [8e2effb53]
  - @backstage/backend-common@0.3.0
  - @backstage/config-loader@0.3.0

## 0.2.0

### Minor Changes

- 28edd7d29: Create backend plugin through CLI

### Patch Changes

- Updated dependencies [5249594c5]
- Updated dependencies [56e4eb589]
- Updated dependencies [e37c0a005]
- Updated dependencies [f00ca3cb8]
- Updated dependencies [6579769df]
- Updated dependencies [8c2b76e45]
- Updated dependencies [440a17b39]
- Updated dependencies [8afce088a]
- Updated dependencies [ce5512bc0]
- Updated dependencies [7bbeb049f]
  - @backstage/backend-common@0.2.0
  - @backstage/config-loader@0.2.0
