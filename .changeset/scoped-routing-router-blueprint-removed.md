---
'@backstage/plugin-app-react': minor
---

**BREAKING**: Removed `RouterBlueprint`. The new frontend system now has a single browser history authority and no longer supports replacing the router at the app root.

Remove overrides that only installed `BrowserRouter`. Move global providers to `AppRootWrapperBlueprint`, and attach alternate routers to individual pages or sub-pages with `PageRouterBlueprint`. The old frontend system's `components.Router` option is unchanged.
