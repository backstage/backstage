---
'@backstage/frontend-plugin-api': patch
---

Added an alpha `PluginWrapperBlueprint` exported from `@backstage/frontend-plugin-api/alpha`, which can install components that will wrap all plugin elements. The `AppRootWrapperBlueprint` has also been deprecated and should be replaced either with the new plugin wrapper, or for app overrides, the new blueprint with the same name from `@backstage/plugin-app-react`.
