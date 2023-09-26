# @backstage/backend-plugin-api

## 0.6.3

### Patch Changes

- ba4506076e2d: Ensure that root scoped services cannot accept (at a type level) plugin scoped deps
- 474b792d6a43: Service factory functions are now marked as feature factories that can be installed in the backend.
- Updated dependencies
  - @backstage/backend-tasks@0.5.8
  - @backstage/plugin-auth-node@0.3.0
  - @backstage/config@1.1.0
  - @backstage/plugin-permission-common@0.7.8
  - @backstage/types@1.1.1

## 0.6.3-next.3

### Patch Changes

- ba4506076e2d: Ensure that root scoped services cannot accept (at a type level) plugin scoped deps
- 474b792d6a43: Service factory functions are now marked as feature factories that can be installed in the backend.
- Updated dependencies
  - @backstage/config@1.1.0-next.2
  - @backstage/plugin-permission-common@0.7.8-next.2
  - @backstage/types@1.1.1-next.0
  - @backstage/backend-tasks@0.5.8-next.3
  - @backstage/plugin-auth-node@0.3.0-next.3

## 0.6.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/plugin-permission-common@0.7.8-next.1
  - @backstage/types@1.1.0

## 0.6.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/backend-tasks@0.5.8-next.1
  - @backstage/plugin-auth-node@0.3.0-next.1
  - @backstage/plugin-permission-common@0.7.8-next.0
  - @backstage/types@1.1.0

## 0.6.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.3.0-next.0
  - @backstage/backend-tasks@0.5.7-next.0
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0
  - @backstage/plugin-permission-common@0.7.7

## 0.6.0

### Minor Changes

- c49785f00cab: **BREAKING**: It is no longer possible to declare options as being required with `createServiceFactory`.
- 629cbd194a87: **BREAKING**: Renamed `coreServices.config` to `coreServices.rootConfig`.
- 51987dbdaf87: **BREAKING**: Removed the ability to define options for plugins and modules. Existing options should be migrated to instead use either static configuration or extension points.
- d008aefef808: **BREAKING**: Removing shared environments concept from the new experimental backend system.

### Patch Changes

- c7aa4ff1793c: Allow modules to register extension points.
- cc9256a33bcc: Added new experimental `featureDiscoveryServiceRef`, available as an `/alpha` export.
- a6d7983f349c: **BREAKING**: Removed the `services` option from `createBackend`. Service factories are now `BackendFeature`s and should be installed with `backend.add(...)` instead. The following should be migrated:

  ```ts
  const backend = createBackend({ services: [myCustomServiceFactory] });
  ```

  To instead pass the service factory via `backend.add(...)`:

  ```ts
  const backend = createBackend();
  backend.add(customRootLoggerServiceFactory);
  ```

- Updated dependencies
  - @backstage/plugin-auth-node@0.2.17
  - @backstage/backend-tasks@0.5.5
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0
  - @backstage/plugin-permission-common@0.7.7

## 0.6.0-next.2

### Patch Changes

- cc9256a33bcc: Added new experimental `featureDiscoveryServiceRef`, available as an `/alpha` export.
- Updated dependencies
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/plugin-auth-node@0.2.17-next.2

## 0.6.0-next.1

### Minor Changes

- 629cbd194a87: **BREAKING**: Renamed `coreServices.config` to `coreServices.rootConfig`.
- d008aefef808: **BREAKING**: Removing shared environments concept from the new experimental backend system.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.2.17-next.1
  - @backstage/backend-tasks@0.5.5-next.1
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0
  - @backstage/plugin-permission-common@0.7.7

## 0.5.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.5-next.0
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0
  - @backstage/plugin-auth-node@0.2.17-next.0
  - @backstage/plugin-permission-common@0.7.7

## 0.5.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.4
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0
  - @backstage/plugin-auth-node@0.2.16
  - @backstage/plugin-permission-common@0.7.7

## 0.5.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.4-next.0
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0
  - @backstage/plugin-auth-node@0.2.16-next.0
  - @backstage/plugin-permission-common@0.7.7-next.0

## 0.5.3

### Patch Changes

- 3bb4158a8aa4: Added startup hooks to the lifecycle services.
- Updated dependencies
  - @backstage/types@1.1.0
  - @backstage/backend-tasks@0.5.3
  - @backstage/plugin-auth-node@0.2.15
  - @backstage/config@1.0.8
  - @backstage/plugin-permission-common@0.7.6

## 0.5.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.3-next.2
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.15-next.2
  - @backstage/plugin-permission-common@0.7.6-next.0

## 0.5.3-next.1

### Patch Changes

- 3bb4158a8aa4: Added startup hooks to the lifecycle services.
- Updated dependencies
  - @backstage/backend-tasks@0.5.3-next.1
  - @backstage/plugin-auth-node@0.2.15-next.1
  - @backstage/plugin-permission-common@0.7.6-next.0
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.5.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.7
  - @backstage/backend-tasks@0.5.3-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.15-next.0
  - @backstage/plugin-permission-common@0.7.5

## 0.5.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.2
  - @backstage/plugin-auth-node@0.2.14
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/plugin-permission-common@0.7.5

## 0.5.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-auth-node@0.2.14-next.1
  - @backstage/config@1.0.7

## 0.5.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.2-next.0
  - @backstage/plugin-auth-node@0.2.14-next.0
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/plugin-permission-common@0.7.5

## 0.5.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.7.5
  - @backstage/backend-tasks@0.5.1
  - @backstage/plugin-auth-node@0.2.13
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.5.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.1-next.2
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.13-next.2
  - @backstage/plugin-permission-common@0.7.5-next.0

## 0.5.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.7.5-next.0
  - @backstage/backend-tasks@0.5.1-next.1
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.13-next.1

## 0.5.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.7
  - @backstage/backend-tasks@0.5.1-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.13-next.0
  - @backstage/plugin-permission-common@0.7.4

## 0.5.0

### Minor Changes

- c1ee073a82b: Added `lastModifiedAt` field on `UrlReaderService` responses and a `lastModifiedAfter` option to `UrlReaderService.readUrl`.

### Patch Changes

- 928a12a9b3e: Internal refactor of `/alpha` exports.
- 482dae5de1c: Updated link to docs.
- Updated dependencies
  - @backstage/plugin-auth-node@0.2.12
  - @backstage/backend-tasks@0.5.0
  - @backstage/plugin-permission-common@0.7.4
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.4.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.2.12-next.2
  - @backstage/backend-tasks@0.5.0-next.2
  - @backstage/config@1.0.7-next.0

## 0.4.1-next.1

### Patch Changes

- 482dae5de1c: Updated link to docs.
- Updated dependencies
  - @backstage/plugin-auth-node@0.2.12-next.1
  - @backstage/plugin-permission-common@0.7.4-next.0
  - @backstage/backend-tasks@0.4.4-next.1
  - @backstage/config@1.0.7-next.0
  - @backstage/types@1.0.2

## 0.4.1-next.0

### Patch Changes

- 928a12a9b3: Internal refactor of `/alpha` exports.
- Updated dependencies
  - @backstage/backend-tasks@0.4.4-next.0
  - @backstage/config@1.0.6
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.12-next.0
  - @backstage/plugin-permission-common@0.7.3

## 0.4.0

### Minor Changes

- e716946103: **BREAKING**: Split out the hook for both lifecycle services so that the first parameter of `addShutdownHook` is the hook function, and the second is the options.
- 0ff03319be: **BREAKING**: The plugin ID option passed to `createBackendPlugin` is now `pluginId`, rather than just `id`. This is to make it match `createBackendModule` more closely.
- 71a5ec0f06: **BREAKING**: Switched out `LogMeta` type for `JsonObject`.
- 5febb216fe: **BREAKING**: The `CacheService` has been changed to remove the indirection of `getClient`, instead making the `CacheClient` methods directly available on the `CacheService`. In order to allow for the creation of clients with default options, there is now a new `.withOptions` method that must be implemented as part of the service interface.
- b86efa2d04: Switch `ServiceFactory` to be an opaque type, keeping only the `service` field as public API, but also adding a type parameter for the service scope.
- 610d65e143: Switched `BackendFeature` to be an opaque type.

### Patch Changes

- 9c9456fd33: Removed the unused `TypesToServiceRef` type
- 181c03edb5: Aligned opaque type markers to all use a `$type` property with namespacing.
- 725383f69d: Tweaked messaging in the README.
- ae88f61e00: The `register` methods passed to `createBackendPlugin` and `createBackendModule`
  now have dedicated `BackendPluginRegistrationPoints` and
  `BackendModuleRegistrationPoints` arguments, respectively. This lets us make it
  clear on a type level that it's not possible to pass in extension points as
  dependencies to plugins (should only ever be done for modules). This has no
  practical effect on code that was already well behaved.
- Updated dependencies
  - @backstage/backend-tasks@0.4.3
  - @backstage/config@1.0.6
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.11
  - @backstage/plugin-permission-common@0.7.3

## 0.4.0-next.2

### Minor Changes

- e716946103: **BREAKING**: Split out the hook for both lifecycle services so that the first parameter of `addShutdownHook` is the hook function, and the second is the options.
- 0ff03319be: **BREAKING**: The plugin ID option passed to `createBackendPlugin` is now `pluginId`, rather than just `id`. This is to make it match `createBackendModule` more closely.
- 71a5ec0f06: **BREAKING**: Switched out `LogMeta` type for `JsonObject`.
- 610d65e143: Switched `BackendFeature` to be an opaque type.

### Patch Changes

- 9c9456fd33: Removed the unused `TypesToServiceRef` type
- 181c03edb5: Aligned opaque type markers to all use a `$type` property with namespacing.
- Updated dependencies
  - @backstage/backend-tasks@0.4.3-next.2
  - @backstage/plugin-auth-node@0.2.11-next.2
  - @backstage/config@1.0.6
  - @backstage/types@1.0.2
  - @backstage/plugin-permission-common@0.7.3

## 0.3.2-next.1

### Patch Changes

- ae88f61e00: The `register` methods passed to `createBackendPlugin` and `createBackendModule`
  now have dedicated `BackendPluginRegistrationPoints` and
  `BackendModuleRegistrationPoints` arguments, respectively. This lets us make it
  clear on a type level that it's not possible to pass in extension points as
  dependencies to plugins (should only ever be done for modules). This has no
  practical effect on code that was already well behaved.
- Updated dependencies
  - @backstage/backend-tasks@0.4.3-next.1
  - @backstage/config@1.0.6
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.11-next.1
  - @backstage/plugin-permission-common@0.7.3

## 0.3.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.4.3-next.0
  - @backstage/plugin-auth-node@0.2.11-next.0

## 0.3.0

### Minor Changes

- 8e06f3cf00: Moved `loggerToWinstonLogger` to `@backstage/backend-common`.
- ecbec4ec4c: Updated all factory function creators to accept options as a top-level callback rather than extra parameter to the main factory function.

### Patch Changes

- 6cfd4d7073: Added `RootLifecycleService` and `rootLifecycleServiceRef`, as well as added a `logger` option to the existing `LifecycleServiceShutdownHook`.
- ecc6bfe4c9: Added `ServiceFactoryOrFunction` type, for use when either a `ServiceFactory` or `() => ServiceFactory` can be used.
- 5b7bcd3c5e: Added `createSharedEnvironment` for creating a shared environment containing commonly used services in a split backend setup of the backend.
- 02b119ff93: Added a new `rootHttpRouterServiceRef` and `RootHttpRouterService` interface.
- 5e2cebe9a3: Migrate `UrlReader` into this package to gradually remove the dependency on backend-common.
- 843a0a158c: Added new core identity service.
- 5437fe488f: Migrated types related to `TokenManagerService`, `CacheService` and `DatabaseService` into backend-plugin-api.
- 6f02d23b01: Moved `PluginEndpointDiscovery` type from backend-common to backend-plugin-api.
- 483e907eaf: The `createServiceFactory` function has been updated to no longer use a duplicate callback pattern for plugin scoped services. The outer callback is now replaced by an optional `createRootContext` method. This change was made in order to support TypeScript 4.9, but it also simplifies the API surface a bit, especially for plugin scoped service factories that don't need to create a root context. In addition, the factory and root context functions can now be synchronous.

  A factory that previously would have looked like this:

  ```ts
  createServiceFactory({
    service: coreServices.cache,
    deps: {
      config: coreServices.config,
      plugin: coreServices.pluginMetadata,
    },
    async factory({ config }) {
      const cacheManager = CacheManager.fromConfig(config);
      return async ({ plugin }) => {
        return cacheManager.forPlugin(plugin.getId());
      };
    },
  });
  ```

  Now instead looks like this:

  ```ts
  createServiceFactory({
    service: coreServices.cache,
    deps: {
      config: coreServices.config,
      plugin: coreServices.pluginMetadata,
    },
    async createRootContext({ config }) {
      return CacheManager.fromConfig(config);
    },
    async factory({ plugin }, manager) {
      return manager.forPlugin(plugin.getId());
    },
  });
  ```

  Although in many cases the `createRootContext` isn't needed, for example:

  ```ts
  createServiceFactory({
    service: coreServices.logger,
    deps: {
      rootLogger: coreServices.rootLogger,
      plugin: coreServices.pluginMetadata,
    },
    factory({ rootLogger, plugin }) {
      return rootLogger.child({ plugin: plugin.getId() });
    },
  });
  ```

- 16054afdec: Documented `coreServices` an all of its members.
- 0e63aab311: Updated the `RootLoggerService` to also have an `addRedactions` method.
- 62b04bb865: Updates all `create*` methods to simplify their type definitions and ensure they all have configuration interfaces.
- Updated dependencies
  - @backstage/backend-tasks@0.4.1
  - @backstage/config@1.0.6
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.9
  - @backstage/plugin-permission-common@0.7.3

## 0.3.0-next.1

### Minor Changes

- 8e06f3cf00: Moved `loggerToWinstonLogger` to `@backstage/backend-common`.

### Patch Changes

- ecc6bfe4c9: Added `ServiceFactoryOrFunction` type, for use when either a `ServiceFactory` or `() => ServiceFactory` can be used.
- 02b119ff93: Added a new `rootHttpRouterServiceRef` and `RootHttpRouterService` interface.
- 5437fe488f: Migrated types related to `TokenManagerService`, `CacheService` and `DatabaseService` into backend-plugin-api.
- 16054afdec: Documented `coreServices` an all of its members.
- 62b04bb865: Updates all `create*` methods to simplify their type definitions and ensure they all have configuration interfaces.
- Updated dependencies
  - @backstage/backend-tasks@0.4.1-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-permission-common@0.7.3-next.0

## 0.2.1-next.0

### Patch Changes

- 6cfd4d7073: Added `RootLifecycleService` and `rootLifecycleServiceRef`, as well as added a `labels` option to the existing `LifecycleServiceShutdownHook`.
- 5e2cebe9a3: Migrate `UrlReader` into this package to gradually remove the dependency on backend-common.
- 6f02d23b01: Moved `PluginEndpointDiscovery` type from backend-common to backend-plugin-api.
- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/backend-tasks@0.4.1-next.0
  - @backstage/plugin-permission-common@0.7.3-next.0

## 0.2.0

### Minor Changes

- 884d749b14: **BREAKING**: All core service references are now exported via a single `coreServices` object. For example, the `loggerServiceRef` is now accessed via `coreServices.logger` instead.
- a025190552: **BREAKING**: All service interfaces are now suffixed with `*Service`.

### Patch Changes

- cb1c2781c0: Updated `LoggerService` interface with more log methods and meta.
- d6dbf1792b: Added initial support for registering shutdown hooks via `lifecycleServiceRef`.
- Updated dependencies
  - @backstage/backend-common@0.17.0
  - @backstage/backend-tasks@0.4.0
  - @backstage/plugin-permission-common@0.7.2
  - @backstage/config@1.0.5

## 0.2.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.4.0-next.3
  - @backstage/plugin-permission-common@0.7.2-next.2
  - @backstage/backend-common@0.17.0-next.3
  - @backstage/config@1.0.5-next.1

## 0.2.0-next.2

### Minor Changes

- 884d749b14: **BREAKING**: All core service references are now exported via a single `coreServices` object. For example, the `loggerServiceRef` is now accessed via `coreServices.logger` instead.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/backend-tasks@0.4.0-next.2
  - @backstage/config@1.0.5-next.1
  - @backstage/plugin-permission-common@0.7.2-next.1

## 0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.1
  - @backstage/backend-tasks@0.4.0-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/plugin-permission-common@0.7.2-next.1

## 0.1.5-next.0

### Patch Changes

- d6dbf1792b: Added initial support for registering shutdown hooks via `lifecycleServiceRef`.
- Updated dependencies
  - @backstage/backend-common@0.16.1-next.0
  - @backstage/plugin-permission-common@0.7.2-next.0
  - @backstage/backend-tasks@0.3.8-next.0
  - @backstage/config@1.0.5-next.0

## 0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0
  - @backstage/backend-tasks@0.3.7
  - @backstage/plugin-permission-common@0.7.1
  - @backstage/config@1.0.4

## 0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.1
  - @backstage/backend-tasks@0.3.7-next.1
  - @backstage/config@1.0.4-next.0
  - @backstage/plugin-permission-common@0.7.1-next.0

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.0
  - @backstage/backend-tasks@0.3.7-next.0
  - @backstage/plugin-permission-common@0.7.1-next.0
  - @backstage/config@1.0.4-next.0

## 0.1.3

### Patch Changes

- 28377dc89f: Allow interfaces to be used for inferred option types.
- a35a27df70: Added documentation for `createBackendModule`, with guidelines for choosing a module ID.
- Updated dependencies
  - @backstage/backend-common@0.15.2
  - @backstage/backend-tasks@0.3.6
  - @backstage/plugin-permission-common@0.7.0
  - @backstage/config@1.0.3

## 0.1.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.3.6-next.2
  - @backstage/backend-common@0.15.2-next.2
  - @backstage/plugin-permission-common@0.7.0-next.2
  - @backstage/config@1.0.3-next.2

## 0.1.3-next.1

### Patch Changes

- a35a27df70: Added documentation for `createBackendModule`, with guidelines for choosing a module ID.
- Updated dependencies
  - @backstage/backend-common@0.15.2-next.1
  - @backstage/backend-tasks@0.3.6-next.1
  - @backstage/config@1.0.3-next.1
  - @backstage/plugin-permission-common@0.6.5-next.1

## 0.1.3-next.0

### Patch Changes

- 28377dc89f: Allow interfaces to be used for inferred option types.
- Updated dependencies
  - @backstage/backend-common@0.15.2-next.0
  - @backstage/backend-tasks@0.3.6-next.0
  - @backstage/config@1.0.3-next.0
  - @backstage/plugin-permission-common@0.6.5-next.0

## 0.1.2

### Patch Changes

- 2c57c0c499: Made `ApiRef.defaultFactory` internal.
- 91eed37a39: Updated `createBackendPlugin` and `createBackendModule` to properly forward lack of options.
- 409ed984e8: Service are now scoped to either `'plugin'` or `'root'` scope. Service factories have been updated to provide dependency instances directly rather than factory functions.
- eef91a2558: Simplified the `ServiceFactory` type and removed `AnyServiceFactory`.
- 854ba37357: The `createServiceFactory` method has been updated to return a higher-order factory that can accept options.
- 68513f169a: When defining a new `ServiceRef` you can now also include a `defaultFactory`, which will be used to construct instances of the service in case there is no explicit factory defined.
- Updated dependencies
  - @backstage/backend-common@0.15.1
  - @backstage/backend-tasks@0.3.5
  - @backstage/config@1.0.2
  - @backstage/plugin-permission-common@0.6.4

## 0.1.2-next.2

### Patch Changes

- 409ed984e8: Service are now scoped to either `'plugin'` or `'root'` scope. Service factories have been updated to provide dependency instances directly rather than factory functions.
- 854ba37357: The `createServiceFactory` method has been updated to return a higher-order factory that can accept options.
- Updated dependencies
  - @backstage/config@1.0.2-next.0
  - @backstage/plugin-permission-common@0.6.4-next.2
  - @backstage/backend-common@0.15.1-next.3
  - @backstage/backend-tasks@0.3.5-next.1

## 0.1.2-next.1

### Patch Changes

- 2c57c0c499: Made `ApiRef.defaultFactory` internal.
- 91eed37a39: Updated `createBackendPlugin` and `createBackendModule` to properly forward lack of options.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.2
  - @backstage/plugin-permission-common@0.6.4-next.1

## 0.1.2-next.0

### Patch Changes

- eef91a2558: Simplified the `ServiceFactory` type and removed `AnyServiceFactory`.
- 68513f169a: When defining a new `ServiceRef` you can now also include a `defaultFactory`, which will be used to construct instances of the service in case there is no explicit factory defined.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.0
  - @backstage/backend-tasks@0.3.5-next.0
  - @backstage/plugin-permission-common@0.6.4-next.0

## 0.1.1

### Patch Changes

- 0599732ec0: Refactored experimental backend system with new type names.
- 34c2f5aca1: The factory returned by `createBackendPlugin` and `createBackendModule` no longer require a parameter to be passed if the options are optional.
- Updated dependencies
  - @backstage/backend-common@0.15.0
  - @backstage/backend-tasks@0.3.4

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0-next.0
  - @backstage/backend-tasks@0.3.4-next.0

## 0.1.0

### Minor Changes

- 91c1d12123: Introduced new package for creating backend plugins using the new alpha backend plugin framework.
  This package is still considered **EXPERIMENTAL** and things will change without warning. Do not use this for production.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1
  - @backstage/plugin-permission-common@0.6.3
  - @backstage/backend-tasks@0.3.3

## 0.1.0-next.0

### Minor Changes

- 91c1d12123: Introduced new package for creating backend plugins using the new alpha backend plugin framework.
  This package is still considered **EXPERIMENTAL** and things will change without warning. Do not use this for production.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.3
  - @backstage/plugin-permission-common@0.6.3-next.1
  - @backstage/backend-tasks@0.3.3-next.3
