---
'@backstage/create-app': patch
---

Removed `plugins.ts` from the app, as plugins are now discovered through the react tree.

To apply this change to an existing app, simply delete `packages/app/src/plugins.ts` along with the import and usage in `packages/app/src/App.tsx`.

Note that there are a few plugins that require explicit registration, in which case you would need to keep them in `plugins.ts`. The set of plugins that need explicit registration is any plugin that doesn't have a component extension that gets rendered as part of the app element tree. An example of such a plugin in the main Backstage repo is `@backstage/plugin-badges`. In the case of the badges plugin this is because there is not yet a component-based API for adding context menu items to the entity layout.

If you have plugins that still rely on route registration through the `register` method of `createPlugin`, these need to be kept in `plugins.ts` as well. However, it is recommended to migrate these to export an extensions component instead.
