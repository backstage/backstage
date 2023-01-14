---
'@backstage/backend-plugin-api': patch
---

The `createServiceFactory` function has been updated to no longer use a duplicate callback pattern for plugin scoped services. The outer callback is now replaced by an optional `createRootContext` method. This change was made in order to support TypeScript 4.9, but it also simplifies the API surface a bit, especially for plugin scoped service factories that don't need to create a root context. In addition, the factory and root context functions can now be synchronous.

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
