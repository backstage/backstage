---
'@backstage/frontend-plugin-api': patch
---

Added a new optional `info` option to `createFrontendPlugin` that lets you provide a loaders for different sources of metadata information about the plugin.

There are two available loaders. The first one is `info.packageJson`, which can be used to point to a `package.json` file for the plugin.This is recommended for any plugin that is defined within its own package, especially all plugins that are published to a package registry. Typical usage looks like this:

```ts
export default createFrontendPlugin({
  pluginId: '...',
  info: {
    packageJson: () => import('../package.json'),
  },
});
```

The second loader is `info.manifest`, which can be used to point to an opaque plugin manifest. This **MUST ONLY** be used by plugins that intended for use within a single organization. Plugins that are published to an open package registry should **NOT** use this loader. The loader is useful to add additional internal metadata associated with the plugin, and it is up to the Backstage app to decide how these manifests are parsed and used. The default manifest parser in an app created with `createApp` from `@backstage/frontend-defaults` is able to parse the default `catalog-info.yaml` format and built-in fields such as `spec.owner`.

Typical usage looks like this:

```ts
export default createFrontendPlugin({
  pluginId: '...',
  info: {
    manifest: () => import('../catalog-info.yaml'),
  },
});
```
