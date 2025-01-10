# @backstage/backend-plugin-api

## 1.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/types@1.2.1-next.0
  - @backstage/config@1.3.2-next.0
  - @backstage/errors@1.2.7-next.0
  - @backstage/plugin-auth-node@0.5.6-next.1
  - @backstage/plugin-permission-common@0.8.4-next.0
  - @backstage/cli-common@0.1.15

## 1.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.6-next.0
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.1
  - @backstage/errors@1.2.6
  - @backstage/types@1.2.0
  - @backstage/plugin-permission-common@0.8.3

## 1.1.0

### Minor Changes

- 12eac85: **EXPERIMENTAL**: Adds a new `instanceMetadataService` to hold information about a specific backend instance.

### Patch Changes

- eef3ef1: Removed unused `express` dependencies.
- 0e9c9fa: The `RootLifecycleService` now has a new `addBeforeShutdownHook` method, and hooks added through this method will run immediately when a termination event is received.

  The backend will not proceed with the shutdown and run the `Shutdown` hooks until all `BeforeShutdown` hooks have completed.

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.5
  - @backstage/errors@1.2.6
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.1
  - @backstage/types@1.2.0
  - @backstage/plugin-permission-common@0.8.3

## 1.1.0-next.2

### Patch Changes

- 0e9c9fa: The `RootLifecycleService` now has a new `addBeforeShutdownHook` method, and hooks added through this method will run immediately when a termination event is received.

  The backend will not proceed with the shutdown and run the `Shutdown` hooks until all `BeforeShutdown` hooks have completed.

- Updated dependencies
  - @backstage/errors@1.2.6-next.0
  - @backstage/plugin-auth-node@0.5.5-next.2
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.1-next.0
  - @backstage/types@1.2.0
  - @backstage/plugin-permission-common@0.8.3-next.0

## 1.1.0-next.1

### Minor Changes

- 12eac85: **EXPERIMENTAL**: Adds a new `instanceMetadataService` to hold information about a specific backend instance.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.5-next.1
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/types@1.2.0
  - @backstage/plugin-permission-common@0.8.2

## 1.0.3-next.0

### Patch Changes

- eef3ef1: Removed unused `express` dependencies.
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.5-next.0
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/types@1.2.0
  - @backstage/plugin-permission-common@0.8.2

## 1.0.2

### Patch Changes

- d52d7f9: Support ISO and ms string forms of durations in config too
- Updated dependencies
  - @backstage/config@1.3.0
  - @backstage/types@1.2.0
  - @backstage/plugin-auth-node@0.5.4
  - @backstage/plugin-permission-common@0.8.2
  - @backstage/cli-common@0.1.15
  - @backstage/errors@1.2.5

## 1.0.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.4-next.2
  - @backstage/cli-common@0.1.15-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.8.1

## 1.0.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.1.15-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.5.4-next.1
  - @backstage/plugin-permission-common@0.8.1

## 1.0.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.4-next.0
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.8.1

## 1.0.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.8.1

## 1.0.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.8.1

## 1.0.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.0
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.8.1

## 1.0.0

### Major Changes

- ec1b4be: Release 1.0 of the new backend system! :tada:

  The backend system is finally getting promoted to 1.0.0. This means that the API is now stable and breaking changes should not occur until version 2.0.0, see our [package versioning policy](https://backstage.io/docs/overview/versioning-policy/#package-versioning-policy) for more information what this means.

  This release also marks the end of the old backend system based on `createRouter` exports. Going forward backend plugins packages will start to deprecate and later this year remove exports supporting the old backend system. If you would like to help out with this transition, see https://github.com/backstage/backstage/issues/26353 or consult the [migration guide](https://backstage.io/docs/backend-system/building-plugins-and-modules/migrating/#remove-support-for-the-old-backend-system).

### Minor Changes

- 19ff127: **BREAKING**: The deprecated identity and token manager services have been removed. This means that `coreServices.identity` and `coreServices.tokenManager` are gone, along with related types and utilities in other packages.
- f687050: Removed the following deprecated exports

  - `BackendPluginConfig` use `CreateBackendPluginOptions`
  - `BackendModuleConfig` use `CreateBackendModuleOptions`
  - `ExtensionPointConfig` use `CreateExtensionPointOptions`

- 4d82481: Removed deprecated `ServiceFactoryOrFunction` type.
- d425fc4: **BREAKING**: The return values from `createBackendPlugin`, `createBackendModule`, and `createServiceFactory` are now simply `BackendFeature` and `ServiceFactory`, instead of the previously deprecated form of a function that returns them. For this reason, `createServiceFactory` also no longer accepts the callback form where you provide direct options to the service. This also affects all `coreServices.*` service refs.

  This may in particular affect tests; if you were effectively doing `createBackendModule({...})()` (note the parentheses), you can now remove those extra parentheses at the end. You may encounter cases of this in your `packages/backend/src/index.ts` too, where you add plugins, modules, and services. If you were using `createServiceFactory` with a function as its argument for the purpose of passing in options, this pattern has been deprecated for a while and is no longer supported. You may want to explore the new multiton patterns to achieve your goals, or moving settings to app-config.

  As part of this change, the `IdentityFactoryOptions` type was removed, and can no longer be used to tweak that service. The identity service was also deprecated some time ago, and you will want to [migrate to the new auth system](https://backstage.io/docs/tutorials/auth-service-migration) if you still rely on it.

### Patch Changes

- cd38da8: Deprecate the `featureDiscoveryServiceRef` in favor of using the new `discoveryFeatureLoader` instead.
- 8052b9b: Add a `toJSON` on refs so that they can appear in expectations in jest tests
- 66dbf0a: Allow the cache service to accept the human duration format for TTL
- 0b2a402: Updates to the config schema to match reality
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.2
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.8.1

## 1.0.0-next.2

### Major Changes

- ec1b4be: Release 1.0 of the new backend system! :tada:

  The backend system is finally getting promoted to 1.0.0. This means that the API is now stable and breaking changes should not occur until version 2.0.0, see our [package versioning policy](https://backstage.io/docs/overview/versioning-policy/#package-versioning-policy) for more information what this means.

  This release also marks the end of the old backend system based on `createRouter` exports. Going forward backend plugins packages will start to deprecate and later this year remove exports supporting the old backend system. If you would like to help out with this transition, see https://github.com/backstage/backstage/issues/26353 or consult the [migration guide](https://backstage.io/docs/backend-system/building-plugins-and-modules/migrating/#remove-support-for-the-old-backend-system).

### Patch Changes

- 8052b9b: Add a `toJSON` on refs so that they can appear in expectations in jest tests
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.2-next.2
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.8.1

## 0.9.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.2-next.1
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.8.1

## 0.9.0-next.0

### Minor Changes

- 19ff127: **BREAKING**: The deprecated identity and token manager services have been removed. This means that `coreServices.identity` and `coreServices.tokenManager` are gone, along with related types and utilities in other packages.
- f687050: Removed the following deprecated exports

  - `BackendPluginConfig` use `CreateBackendPluginOptions`
  - `BackendModuleConfig` use `CreateBackendModuleOptions`
  - `ExtensionPointConfig` use `CreateExtensionPointOptions`

- 4d82481: Removed deprecated `ServiceFactoryOrFunction` type.
- d425fc4: **BREAKING**: The return values from `createBackendPlugin`, `createBackendModule`, and `createServiceFactory` are now simply `BackendFeature` and `ServiceFactory`, instead of the previously deprecated form of a function that returns them. For this reason, `createServiceFactory` also no longer accepts the callback form where you provide direct options to the service. This also affects all `coreServices.*` service refs.

  This may in particular affect tests; if you were effectively doing `createBackendModule({...})()` (note the parentheses), you can now remove those extra parentheses at the end. You may encounter cases of this in your `packages/backend/src/index.ts` too, where you add plugins, modules, and services. If you were using `createServiceFactory` with a function as its argument for the purpose of passing in options, this pattern has been deprecated for a while and is no longer supported. You may want to explore the new multiton patterns to achieve your goals, or moving settings to app-config.

  As part of this change, the `IdentityFactoryOptions` type was removed, and can no longer be used to tweak that service. The identity service was also deprecated some time ago, and you will want to [migrate to the new auth system](https://backstage.io/docs/tutorials/auth-service-migration) if you still rely on it.

### Patch Changes

- cd38da8: Deprecate the `featureDiscoveryServiceRef` in favor of using the new `discoveryFeatureLoader` instead.
- 66dbf0a: Allow the cache service to accept the human duration format for TTL
- 0b2a402: Updates to the config schema to match reality
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.2-next.0
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.8.1

## 0.8.0

### Minor Changes

- 389f5a4: **BREAKING** Deleted the following deprecated `UrlReader` exports

  - ReadUrlOptions: Use `UrlReaderServiceReadUrlOptions` instead;
  - ReadUrlResponse: Use `UrlReaderServiceReadUrlResponse` instead;
  - ReadTreeOptions: Use `UrlReaderServiceReadTreeOptions` instead;
  - ReadTreeResponse: Use `UrlReaderServiceReadTreeResponse` instead;
  - ReadTreeResponseFile: Use `UrlReaderServiceReadTreeResponseFile` instead;
  - ReadTreeResponseDirOptions: Use `UrlReaderServiceReadTreeResponseDirOptions` instead;
  - SearchOptions: Use `UrlReaderServiceSearchOptions` instead;
  - SearchResponse: Use `UrlReaderServiceSearchResponse` instead;
  - SearchResponseFile: Use `UrlReaderServiceSearchResponseFile` instead.

- 7c5f3b0: The `createServiceRef` function now accepts a new boolean `multiple` option. The `multiple` option defaults to `false` and when set to `true`, it enables that multiple implementation are installed for the created service ref.

  We're looking for ways to make it possible to augment services without the need to replace the entire service.

  Typical example of that being the ability to install support for additional targets for the `UrlReader` service without replacing the service itself. This achieves that by allowing us to define services that can have multiple simultaneous implementation, allowing the `UrlReader` implementation to depend on such a service to collect all possible implementation of support for external targets:

  ```diff
  // @backstage/backend-defaults

  + export const urlReaderFactoriesServiceRef = createServiceRef<ReaderFactory>({
  +   id: 'core.urlReader.factories',
  +   scope: 'plugin',
  +   multiton: true,
  + });

  ...

  export const urlReaderServiceFactory = createServiceFactory({
    service: coreServices.urlReader,
    deps: {
      config: coreServices.rootConfig,
      logger: coreServices.logger,
  +   factories: urlReaderFactoriesServiceRef,
    },
  -  async factory({ config, logger }) {
  +  async factory({ config, logger, factories }) {
      return UrlReaders.default({
        config,
        logger,
  +     factories,
      });
    },
  });
  ```

  With that, you can then add more custom `UrlReader` factories by installing more implementations of the `urlReaderFactoriesServiceRef` in your backend instance. Something like:

  ```ts
  // packages/backend/index.ts
  import { createServiceFactory } from '@backstage/backend-plugin-api';
  import { urlReaderFactoriesServiceRef } from '@backstage/backend-defaults';
  ...

  backend.add(createServiceFactory({
    service: urlReaderFactoriesServiceRef,
    deps: {},
    async factory() {
      return CustomUrlReader.factory;
    },
  }));

  ...

  ```

- c99c620: **BREAKING** Removed the following deprecated types:

  - `ServiceRefConfig` use `ServiceRefOptions`
  - `RootServiceFactoryConfig` use `RootServiceFactoryOptions`
  - `PluginServiceFactoryConfig` use `PluginServiceFactoryOptions`

### Patch Changes

- 6061061: Added `createBackendFeatureLoader`, which can be used to create an installable backend feature that can in turn load in additional backend features in a dynamic way.
- ba9abf4: The `SchedulerService` now allows tasks with `frequency: { trigger: 'manual' }`. This means that the task will not be scheduled, but rather run only when manually triggered with `SchedulerService.triggerTask`.
- 8b13183: Added `createBackendFeatureLoader`, which can be used to programmatically select and install backend features.

  A feature loader can return an list of features to be installed, for example in the form on an `Array` or other for of iterable, which allows for the loader to be defined as a generator function. Both synchronous and asynchronous loaders are supported.

  Additionally, a loader can depend on services in its implementation, with the restriction that it can only depend on root-scoped services, and it may not override services that have already been instantiated.

  ```ts
  const searchLoader = createBackendFeatureLoader({
    deps: {
      config: coreServices.rootConfig,
    },
    *loader({ config }) {
      // Example of a custom config flag to enable search
      if (config.getOptionalString('customFeatureToggle.search')) {
        yield import('@backstage/plugin-search-backend/alpha');
        yield import('@backstage/plugin-search-backend-module-catalog/alpha');
        yield import('@backstage/plugin-search-backend-module-explore/alpha');
        yield import('@backstage/plugin-search-backend-module-techdocs/alpha');
      }
    },
  });
  ```

- ddde5fe: Fixed a type issue where plugin and modules depending on multiton services would not receive the correct type.
- f011d1b: fix typo in `getPluginRequestToken` comments
- Updated dependencies
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-auth-node@0.5.0
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.8.0-next.3

### Patch Changes

- ddde5fe: Fixed a type issue where plugin and modules depending on multiton services would not receive the correct type.
- Updated dependencies
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.5.0-next.3
  - @backstage/plugin-permission-common@0.8.1-next.1

## 0.8.0-next.2

### Minor Changes

- 7c5f3b0: The `createServiceRef` function now accepts a new boolean `multiple` option. The `multiple` option defaults to `false` and when set to `true`, it enables that multiple implementation are installed for the created service ref.

  We're looking for ways to make it possible to augment services without the need to replace the entire service.

  Typical example of that being the ability to install support for additional targets for the `UrlReader` service without replacing the service itself. This achieves that by allowing us to define services that can have multiple simultaneous implementation, allowing the `UrlReader` implementation to depend on such a service to collect all possible implementation of support for external targets:

  ```diff
  // @backstage/backend-defaults

  + export const urlReaderFactoriesServiceRef = createServiceRef<ReaderFactory>({
  +   id: 'core.urlReader.factories',
  +   scope: 'plugin',
  +   multiton: true,
  + });

  ...

  export const urlReaderServiceFactory = createServiceFactory({
    service: coreServices.urlReader,
    deps: {
      config: coreServices.rootConfig,
      logger: coreServices.logger,
  +   factories: urlReaderFactoriesServiceRef,
    },
  -  async factory({ config, logger }) {
  +  async factory({ config, logger, factories }) {
      return UrlReaders.default({
        config,
        logger,
  +     factories,
      });
    },
  });
  ```

  With that, you can then add more custom `UrlReader` factories by installing more implementations of the `urlReaderFactoriesServiceRef` in your backend instance. Something like:

  ```ts
  // packages/backend/index.ts
  import { createServiceFactory } from '@backstage/backend-plugin-api';
  import { urlReaderFactoriesServiceRef } from '@backstage/backend-defaults';
  ...

  backend.add(createServiceFactory({
    service: urlReaderFactoriesServiceRef,
    deps: {},
    async factory() {
      return CustomUrlReader.factory;
    },
  }));

  ...

  ```

### Patch Changes

- 6061061: Added `createBackendFeatureLoader`, which can be used to create an installable backend feature that can in turn load in additional backend features in a dynamic way.
- ba9abf4: The `SchedulerService` now allows tasks with `frequency: { trigger: 'manual' }`. This means that the task will not be scheduled, but rather run only when manually triggered with `SchedulerService.triggerTask`.
- 8b13183: Added `createBackendFeatureLoader`, which can be used to programmatically select and install backend features.

  A feature loader can return an list of features to be installed, for example in the form on an `Array` or other for of iterable, which allows for the loader to be defined as a generator function. Both synchronous and asynchronous loaders are supported.

  Additionally, a loader can depend on services in its implementation, with the restriction that it can only depend on root-scoped services, and it may not override services that have already been instantiated.

  ```ts
  const searchLoader = createBackendFeatureLoader({
    deps: {
      config: coreServices.rootConfig,
    },
    *loader({ config }) {
      // Example of a custom config flag to enable search
      if (config.getOptionalString('customFeatureToggle.search')) {
        yield import('@backstage/plugin-search-backend/alpha');
        yield import('@backstage/plugin-search-backend-module-catalog/alpha');
        yield import('@backstage/plugin-search-backend-module-explore/alpha');
        yield import('@backstage/plugin-search-backend-module-techdocs/alpha');
      }
    },
  });
  ```

- Updated dependencies
  - @backstage/plugin-permission-common@0.8.1-next.1
  - @backstage/plugin-auth-node@0.5.0-next.2
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.7.1-next.1

### Patch Changes

- f011d1b: fix typo in `getPluginRequestToken` comments
- Updated dependencies
  - @backstage/plugin-permission-common@0.8.1-next.0
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.18-next.1

## 0.7.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.18-next.0
  - @backstage/plugin-permission-common@0.8.0

## 0.7.0

### Minor Changes

- 36f91e8: **BREAKING**: The `PermissionsService` no longer supports passing the deprecated `token` option, and the request options are now required.

### Patch Changes

- 53ced70: Added a new Root Health Service which adds new endpoints for health checks.
- 083eaf9: Fix bug where ISO durations could no longer be used for schedules
- 062c01c: Deprecated the ability to define options for service factories through `createServiceFactory`. In the future all service factories will return a plain `ServiceFactory` object, rather than allowing users to pass options to the factory. To allow for customization of a service implementation one can instead export one or a few building blocks that allows for simple re-implementation of the service instead.

  For example, instead of:

  ```ts
  export const fooServiceFactory = createServiceFactory<FooService>(
    (options?: { bar: string }) => ({
      service: fooServiceRef,
      deps: { logger: coreServices.logger },
      factory({ logger }) {
        return {
          // Implementation of the foo service using the `bar` option.
        };
      },
    }),
  );
  ```

  We instead encourage service implementations to provide an easy to use API for re-implementing the service for advanced use-cases:

  ```ts
  /** @public */
  export class DefaultFooService implements FooService {
    static create(options: { bar: string; logger: LoggerService }) {
      return new DefaultFooService(options.logger, options.bar ?? 'default');
    }

    private constructor(
      private readonly logger: string,
      private readonly bar: string,
    ) {}

    // The rest of the implementation
  }
  ```

  A user that wishes to customize the service can then easily do so by defining their own factory:

  ```ts
  export const customFooServiceFactory = createServiceFactory<FooService>({
    service: fooServiceRef,
    deps: { logger: coreServices.logger },
    factory({ logger }) {
      return DefaultFooService.create({ logger, bar: 'baz' });
    },
  });
  ```

  This is of course more verbose than the previous solution where the factory could be customized through `fooServiceFactory({ bar: 'baz' })`, but this is a simplified which in practice should be using static configuration instead.

  In cases where the old options patterns significantly improves the usability of the service factory, the old pattern can still be implemented like this:

  ```ts
  const fooServiceFactoryWithOptions = (options?: { bar: string }) =>
    createServiceFactory<FooService>({
      service: fooServiceRef,
      deps: { logger: coreServices.logger },
      factory({ logger }) {
        return {
          // Implementation of the foo service using the `bar` option.
        };
      },
    });

  export const fooServiceFactory = Object.assign(
    fooServiceFactoryWithOptions,
    fooServiceFactoryWithOptions(),
  );
  ```

  This change is being made because the ability to define an options callback encourages bad design of services factories. When possible, a service should be configurable through static configuration, and the existence of options may discourage that. More importantly though, the existing options do not work well with the dependency injection system of services, which is a problem for callbacks an other more advanced options. This lead to a bad pattern where only a few explicit dependencies where made available in callbacks, rather than providing an API that allowed simple re-implementation of the service with full access to dependency injection.

  A separate benefit of this change is that it simplifies the TypeScript types in a way that allows TypeScript to provide a much better error message when a service factory doesn't properly implement the service interface.

- fe47a3e: All service config types were renamed to option types in order to standardize frontend and backend `create*` function signatures:

  - The `ServiceRefConfig` type was renamed to`ServiceRefOptions`;
  - The `RootServiceFactoryConfig` type was renamed to `RootServiceFactoryOptions`;
  - The `PluginServiceFactoryConfig` type was renamed to `PluginServiceFactoryOptions`

- Updated dependencies
  - @backstage/plugin-permission-common@0.8.0
  - @backstage/plugin-auth-node@0.4.17
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.6.22-next.1

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.17-next.1
  - @backstage/plugin-permission-common@0.7.14

## 0.6.21-next.0

### Patch Changes

- 53ced70: Added a new Root Health Service which adds new endpoints for health checks.
- 083eaf9: Fix bug where ISO durations could no longer be used for schedules
- Updated dependencies
  - @backstage/plugin-auth-node@0.4.16-next.0
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.14

## 0.6.19

### Patch Changes

- 78a0b08: **DEPRECATION**: You should no longer do a function call on backend features when adding them to backends. The support for doing that is deprecated, and you should remove all trailing `()` parentheses after plugins and modules where you add them to your backend or test backends (e.g. when using `startTestBackend`).

  The background for this is that `createBackendPlugin` and `createBackendModule` function now effectively return a `BackendFeature` rather than a `() => BackendFeature`. This is part of the cleanup efforts for New Backend System 1.0. In the short run this is non-breaking because the feature type has been given a callback signature that returns itself. But we strongly recommend that you remove all now-redundant calls made to feature objects, because that callback signature will be removed in a future release.

  Service factories are still callbacks at this point.

  Example change:

  ```diff
   await startTestBackend({
     features: [
       eventsServiceFactory(), // service - stays unchanged
  -    catalogModuleBitbucketCloudEntityProvider(), // module - remove parentheses
  +    catalogModuleBitbucketCloudEntityProvider,
  ```

- 9bdc3e8: In tests, return `null` rather than throwing an error when trying to get the `ExtensionPoint.T` property, so that tests asserting the property are not easily broken.
- 9e63318: Added an optional `accessRestrictions` to external access service tokens and service principals in general, such that you can limit their access to certain plugins or permissions.
- 3aa3fc7: Marked the `TokenManagerService` and `IdentityService` types as deprecated
- b2ee7f3: Deprecated all of the `UrlReader` related type names and replaced them with prefixed versions. Please update your imports.

  - `ReadTreeOptions` was renamed to `UrlReaderServiceReadTreeOptions`
  - `ReadTreeResponse` was renamed to `UrlReaderServiceReadTreeResponse`
  - `ReadTreeResponseDirOptions` was renamed to `UrlReaderServiceReadTreeResponseDirOptions`
  - `ReadTreeResponseFile` was renamed to `UrlReaderServiceReadTreeResponseFile`
  - `ReadUrlResponse` was renamed to `UrlReaderServiceReadUrlResponse`
  - `ReadUrlOptions` was renamed to `UrlReaderServiceReadUrlOptions`
  - `SearchOptions` was renamed to `UrlReaderServiceSearchOptions`
  - `SearchResponse` was renamed to `UrlReaderServiceSearchResponse`
  - `SearchResponseFile` was renamed to `UrlReaderServiceSearchResponseFile`

- 9539a0b: Improved `coreServices` doc comments
- 6551b3d: Moved the declaration of the `SchedulerService` here, along with prefixed versions of all of the types it depends on, from `@backstage/backend-tasks`
- 0665b7e: Renamed `BackendPluginConfig`, `BackendModuleConfig`, and `ExtensionPointConfig` respectively to `CreateBackendPluginOptions`, `CreateBackendModuleOptions`, and `CreateExtensionPointOptions` to standardize frontend and backend factories signatures.
- 1779188: Start using the `isDatabaseConflictError` helper from the `@backstage/backend-plugin-api` package in order to avoid dependency with the soon to deprecate `@backstage/backend-common` package.
- Updated dependencies
  - @backstage/plugin-auth-node@0.4.14
  - @backstage/plugin-permission-common@0.7.14
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.6.19-next.3

### Patch Changes

- 9bdc3e8: In tests, return `null` rather than throwing an error when trying to get the `ExtensionPoint.T` property, so that tests asserting the property are not easily broken.
- b2ee7f3: Deprecated all of the `UrlReader` related type names and replaced them with prefixed versions. Please update your imports.

  - `ReadTreeOptions` was renamed to `UrlReaderServiceReadTreeOptions`
  - `ReadTreeResponse` was renamed to `UrlReaderServiceReadTreeResponse`
  - `ReadTreeResponseDirOptions` was renamed to `UrlReaderServiceReadTreeResponseDirOptions`
  - `ReadTreeResponseFile` was renamed to `UrlReaderServiceReadTreeResponseFile`
  - `ReadUrlResponse` was renamed to `UrlReaderServiceReadUrlResponse`
  - `ReadUrlOptions` was renamed to `UrlReaderServiceReadUrlOptions`
  - `SearchOptions` was renamed to `UrlReaderServiceSearchOptions`
  - `SearchResponse` was renamed to `UrlReaderServiceSearchResponse`
  - `SearchResponseFile` was renamed to `UrlReaderServiceSearchResponseFile`

- Updated dependencies
  - @backstage/plugin-auth-node@0.4.14-next.3
  - @backstage/plugin-permission-common@0.7.14-next.0
  - @backstage/cli-common@0.1.14-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.6.19-next.2

### Patch Changes

- 3aa3fc7: Marked the `TokenManagerService` and `IdentityService` types as deprecated
- Updated dependencies
  - @backstage/plugin-auth-node@0.4.14-next.2
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.13

## 0.6.19-next.1

### Patch Changes

- 9e63318: Added an optional `accessRestrictions` to external access service tokens and service principals in general, such that you can limit their access to certain plugins or permissions.
- 0665b7e: Renamed `BackendPluginConfig`, `BackendModuleConfig`, and `ExtensionPointConfig` respectively to `CreateBackendPluginOptions`, `CreateBackendModuleOptions`, and `CreateExtensionPointOptions` to standardize frontend and backend factories signatures.
- Updated dependencies
  - @backstage/plugin-auth-node@0.4.14-next.1

## 0.6.19-next.0

### Patch Changes

- 6551b3d: Moved the declaration of the `SchedulerService` here, along with prefixed versions of all of the types it depends on, from `@backstage/backend-tasks`
- 1779188: Start using the `isDatabaseConflictError` helper from the `@backstage/backend-plugin-api` package in order to avoid dependency with the soon to deprecate `@backstage/backend-common` package.
- Updated dependencies
  - @backstage/plugin-auth-node@0.4.14-next.0
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.13

## 0.6.18

### Patch Changes

- d229dc4: Move path utilities from `backend-common` to the `backend-plugin-api` package.
- 1fedf0c: Removed explicit `toString()` method from `ServiceRef` type.
- Updated dependencies
  - @backstage/backend-tasks@0.5.23
  - @backstage/plugin-auth-node@0.4.13

## 0.6.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.23-next.1
  - @backstage/plugin-auth-node@0.4.13-next.1

## 0.6.18-next.0

### Patch Changes

- 1fedf0c: Removed explicit `toString()` method from `ServiceRef` type.
- Updated dependencies
  - @backstage/plugin-auth-node@0.4.13-next.0
  - @backstage/backend-tasks@0.5.23-next.0
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.13

## 0.6.17

### Patch Changes

- 007e7ea: Added a new required `listPublicServiceKeys` to `AuthService`.
- 54f2ac8: Added `initialization` option to `createServiceFactory` which defines the initialization strategy for the service. The default strategy mimics the current behavior where plugin scoped services are initialized lazily by default and root scoped services are initialized eagerly.
- 4fecffc: The credentials passed to the `issueUserCookie` method of the `HttpAuthService` are no longer required to represent a user principal.
- Updated dependencies
  - @backstage/backend-tasks@0.5.22
  - @backstage/plugin-auth-node@0.4.12
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.13

## 0.6.17-next.1

### Patch Changes

- 007e7ea: Added a new required `listPublicServiceKeys` to `AuthService`.
- 54f2ac8: Added `initialization` option to `createServiceFactory` which defines the initialization strategy for the service. The default strategy mimics the current behavior where plugin scoped services are initialized lazily by default and root scoped services are initialized eagerly.
- 4fecffc: The credentials passed to the `issueUserCookie` method of the `HttpAuthService` are no longer required to represent a user principal.
- Updated dependencies
  - @backstage/plugin-auth-node@0.4.12-next.1
  - @backstage/backend-tasks@0.5.22-next.1
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.13

## 0.6.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.22-next.0
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.12-next.0
  - @backstage/plugin-permission-common@0.7.13

## 0.6.16

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.4.11
  - @backstage/backend-tasks@0.5.21
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.13

## 0.6.15

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.4.10
  - @backstage/backend-tasks@0.5.20
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.13

## 0.6.14

### Patch Changes

- 4a3d434: Added the new [`auth`](https://backstage.io/docs/backend-system/core-services/auth/), [`httpAuth`](https://backstage.io/docs/backend-system/core-services/http-auth), and [`userInfo`](https://backstage.io/docs/backend-system/core-services/user-info) services that were created as part of [BEP-0003](https://github.com/backstage/backstage/tree/master/beps/0003-auth-architecture-evolution) to the `coreServices`.

  At the same time, the [`httpRouter`](https://backstage.io/docs/backend-system/core-services/http-router) service gained a new `addAuthPolicy` method that lets your plugin declare exemptions to the default auth policy - for example if you want to allow unauthenticated or cookie-based access to some subset of your feature routes.

  If you have migrated to the new backend system, please see the [Auth Service Migration tutorial](https://backstage.io/docs/tutorials/auth-service-migration) for more information on how to move toward using these services.

- 0502d82: Updated the `PermissionsService` methods to accept `BackstageCredentials` through options.
- Updated dependencies
  - @backstage/plugin-auth-node@0.4.9
  - @backstage/config@1.2.0
  - @backstage/plugin-permission-common@0.7.13
  - @backstage/backend-tasks@0.5.19
  - @backstage/types@1.1.1

## 0.6.14-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.4.9-next.2
  - @backstage/backend-tasks@0.5.19-next.2
  - @backstage/config@1.2.0-next.1
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.13-next.1

## 0.6.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/types@1.1.1

## 0.6.13-next.0

### Patch Changes

- 4a3d434: Added the new [`auth`](https://backstage.io/docs/backend-system/core-services/auth/), [`httpAuth`](https://backstage.io/docs/backend-system/core-services/http-auth), and [`userInfo`](https://backstage.io/docs/backend-system/core-services/user-info) services that were created as part of [BEP-0003](https://github.com/backstage/backstage/tree/master/beps/0003-auth-architecture-evolution) to the `coreServices`.

  At the same time, the [`httpRouter`](https://backstage.io/docs/backend-system/core-services/http-router) service gained a new `addAuthPolicy` method that lets your plugin declare exemptions to the default auth policy - for example if you want to allow unauthenticated or cookie-based access to some subset of your feature routes.

  If you have migrated to the new backend system, please see the [Auth Service Migration tutorial](https://backstage.io/docs/tutorials/auth-service-migration) for more information on how to move toward using these services.

- 0502d82: Updated the `PermissionsService` methods to accept `BackstageCredentials` through options.
- Updated dependencies
  - @backstage/plugin-auth-node@0.4.8-next.0
  - @backstage/plugin-permission-common@0.7.13-next.0
  - @backstage/backend-tasks@0.5.18-next.0
  - @backstage/config@1.1.2-next.0
  - @backstage/types@1.1.1

## 0.6.10

### Patch Changes

- 9aac2b0: Use `--cwd` as the first `yarn` argument
- 1f020fe: Support `token` in `readTree`, `readUrl` and `search`
- Updated dependencies
  - @backstage/plugin-auth-node@0.4.4
  - @backstage/backend-tasks@0.5.15
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.12

## 0.6.10-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.15-next.3
  - @backstage/plugin-auth-node@0.4.4-next.3
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.12

## 0.6.10-next.2

### Patch Changes

- 9aac2b0: Use `--cwd` as the first `yarn` argument
- Updated dependencies
  - @backstage/backend-tasks@0.5.15-next.2
  - @backstage/plugin-auth-node@0.4.4-next.2
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.12

## 0.6.10-next.1

### Patch Changes

- 1f020fe: Support `token` in `readTree`, `readUrl` and `search`
- Updated dependencies
  - @backstage/backend-tasks@0.5.15-next.1
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.4-next.1
  - @backstage/plugin-permission-common@0.7.12

## 0.6.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.15-next.0
  - @backstage/plugin-auth-node@0.4.4-next.0
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.12

## 0.6.9

### Patch Changes

- 516fd3e: Updated README to reflect release status
- Updated dependencies
  - @backstage/plugin-permission-common@0.7.12
  - @backstage/backend-tasks@0.5.14
  - @backstage/plugin-auth-node@0.4.3
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## 0.6.9-next.2

### Patch Changes

- 516fd3e: Updated README to reflect release status
- Updated dependencies
  - @backstage/plugin-auth-node@0.4.3-next.2
  - @backstage/backend-tasks@0.5.14-next.2

## 0.6.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.1
  - @backstage/backend-tasks@0.5.14-next.1
  - @backstage/plugin-auth-node@0.4.3-next.1
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.11

## 0.6.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.14-next.0
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.3-next.0
  - @backstage/plugin-permission-common@0.7.11

## 0.6.8

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.13
  - @backstage/plugin-auth-node@0.4.2
  - @backstage/plugin-permission-common@0.7.11
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## 0.6.8-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.13-next.3
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.2-next.3
  - @backstage/plugin-permission-common@0.7.10

## 0.6.8-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.4.2-next.2
  - @backstage/backend-tasks@0.5.13-next.2
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.10

## 0.6.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.2-next.1
  - @backstage/plugin-permission-common@0.7.10

## 0.6.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.13-next.0
  - @backstage/plugin-auth-node@0.4.2-next.0
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.10

## 0.6.7

### Patch Changes

- 013611b42e: `knex` has been bumped to major version 3 and `better-sqlite3` to major version 9, which deprecate node 16 support.
- Updated dependencies
  - @backstage/backend-tasks@0.5.12
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.1

## 0.6.7-next.2

### Patch Changes

- [#20570](https://github.com/backstage/backstage/pull/20570) [`013611b42e`](https://github.com/backstage/backstage/commit/013611b42ed457fefa9bb85fddf416cf5e0c1f76) Thanks [@freben](https://github.com/freben)! - `knex` has been bumped to major version 3 and `better-sqlite3` to major version 9, which deprecate node 16 support.

- Updated dependencies
  - @backstage/backend-tasks@0.5.12-next.2
  - @backstage/plugin-auth-node@0.4.1-next.2

## 0.6.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.12-next.1
  - @backstage/plugin-auth-node@0.4.1-next.1
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.9

## 0.6.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.12-next.0
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.1-next.0
  - @backstage/plugin-permission-common@0.7.9

## 0.6.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.9

## 0.6.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.4.0-next.2
  - @backstage/backend-tasks@0.5.11-next.2
  - @backstage/config@1.1.1-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.9-next.0

## 0.6.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.10-next.1
  - @backstage/plugin-auth-node@0.3.2-next.1
  - @backstage/config@1.1.0
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.8

## 0.6.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.3.2-next.0
  - @backstage/config@1.1.0
  - @backstage/backend-tasks@0.5.10-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.8

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
