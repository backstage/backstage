---
'@backstage/frontend-plugin-api': minor
---

**BREAKING**: Promoted `PluginWrapperApi`, `pluginWrapperApiRef`, `PluginWrapperBlueprint`, and the new `PluginWrapperDefinition` type from `@alpha` to `@public`. These are now available from the main package entry point rather than only through `/alpha`.

The `PluginWrapperApi` type now has a required `getRootWrapper()` method that returns a root wrapper component. The `pluginWrapperApiRef` ID changed from `core.plugin-wrapper.alpha` to `core.plugin-wrapper`.

The `PluginWrapperBlueprint` now accepts `PluginWrapperDefinition` as the loader return type, which supports an optional `useWrapperValue` hook that allows sharing state between wrapper instances.
