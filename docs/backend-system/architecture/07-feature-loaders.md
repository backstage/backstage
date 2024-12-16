---
id: feature-loaders
title: Backend Feature Loaders
sidebar_label: Feature Loaders
# prettier-ignore
description: Backend feature loaders
---

Backend feature loaders are used to programmatically select and install features in a Backstage backend. They can service a wide range of use cases, such as enabling or disabling features based on static configuration, dynamically load features at runtime, or conditionally load features based on the state of a system.

Feature loaders are defined using the `createBackendFeatureLoader` function, exported by `@backstage/backend-plugin-api`. It accepts a `loader` function, as well as an optional `deps` object for declaring service dependencies. Unlike plugins and modules, feature loaders are limited to only depending on root-scoped services, but that still allows access to for example the [root config](../core-services/root-config.md) and [root logger](../core-services/root-logger.md) services.

The `loader` function can be defined in many different ways, with the main requirement being that it returns a list of `BackendFeature`s in some form. A backend feature is the kind of object that you can pass to `backend.add(...)`, for example services factories, plugins, modules, or even other feature loaders. The `loader` function can be synchronous or asynchronous, and can be defined as a generator function to allow for more complex logic.

## Examples

The following are a few example of how feature loaders can be used:

### Simple list of features

A feature loader can simply return a list of features to be installed:

```ts
export default createBackendFeatureLoader({
  loader() {
    return [
      import('@backstage/plugin-search-backend'),
      import('@backstage/plugin-search-backend-module-catalog'),
      import('@backstage/plugin-search-backend-module-explore'),
      import('@backstage/plugin-search-backend-module-techdocs'),
    ];
  },
});
```

It can also encapsulate a collection of custom features:

```ts
export default createBackendFeatureLoader({
  // Async loader is fine too
  async loader() {
    return [
      createBackendPlugin({
        ...
      }),
      createBackendModule({
        ...
      }),
    ]
  },
});
```

### Conditional loading

A feature loader can access root-scoped services, such as the config service. This allows for conditional loading of features based on configuration. It is often convenient to use a generator function for this purpose:

```ts
export default createBackendFeatureLoader({
  deps: {
    config: coreServices.rootConfig,
  },
  // The `*` in front of the function name makes it a generator function
  *loader({ config }) {
    // Example of a custom config flag to enable search
    if (config.getOptionalString('customFeatureToggle.search')) {
      yield import('@backstage/plugin-search-backend');
      yield import('@backstage/plugin-search-backend-module-catalog');
      yield import('@backstage/plugin-search-backend-module-explore');
      yield import('@backstage/plugin-search-backend-module-techdocs');
    }
  },
});
```

### Overriding service factories

Service factories registered by feature loaders have lower priority than ones added directly via `backend.add`. This allows you to use a feature loader for a larger number of service implementations, but still override individual services.

The ordering in which different feature loaders or service factories are added does not matter. There is also no priority between feature loaders, if two different feature loaders add a factory for the same service, the backend will fail to start.

```ts
const backend = createBackend();

backend.add(
  createBackendFeatureLoader({
    async *loader() {
      yield import('./commonDiscoveryService'); // discovery service
      yield import('./commonRootLoggerService'); // root logger service
    },
  }),
);

backend.add(import('./myDiscoveryService')); // discovery service
```

The result of the above example is that the backend starts up with `./myDiscoveryService` as the discovery service implementation, while `./commonDiscoveryService` is ignored. The `./commonRootLoggerService` will still be used.

### Dynamic logic

A feature loader can also be asynchronous, and for example fetch data from an external source to determine which features to load:

```ts
export default createBackendFeatureLoader({
  // The `async *` in front of the function name makes it an async generator function.
  async *loader() {
    const localMetadata = await readMetadataFromDisk();

    if (localMetadata.enableSearch) {
      yield import('@backstage/plugin-search-backend');
      yield import('@backstage/plugin-search-backend-module-catalog');

      const remoteMetadata = await fetchMetadata();

      if (remoteMetadata.enableExplore) {
        yield import('@backstage/plugin-search-backend-module-explore');
      }
      if (remoteMetadata.enableTechDocs) {
        yield import('@backstage/plugin-search-backend-module-techdocs');
      }
    }
  },
});
```
