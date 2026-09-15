---
'@backstage/core-compat-api': minor
---

**BREAKING**: `convertLegacyAppOptions` now rejects `components.Router`. Remove plain `BrowserRouter` wrappers, move global providers to `AppRootWrapperBlueprint`, and use page router adapters for page-specific routing. Apps that remain on the old frontend system are unaffected.

Converted legacy pages receive a scoped React Router v6 adapter automatically, preserving their nested routes without changes to the plugin.

See the [app migration guide](https://backstage.io/docs/frontend-system/building-apps/migrating#components) for examples and custom history configuration.
