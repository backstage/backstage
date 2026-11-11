---
'@backstage/core-compat-api': minor
---

**BREAKING**: `convertLegacyAppOptions` now rejects `components.Router`: remove plain `BrowserRouter` wrappers, move global providers to `AppRootWrapperBlueprint`, and use page router adapters for page-specific routing, with converted legacy pages receiving a scoped React Router v6 adapter automatically. See the [1.57 migration notes](https://backstage.io/docs/frontend-system/architecture/migrations#157) for detailed migration steps.
