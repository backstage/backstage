---
'@backstage/backend-plugin-api': patch
---

Added `createBackendFeatureLoader`, which can be used to programmatically select and install backend features.

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
