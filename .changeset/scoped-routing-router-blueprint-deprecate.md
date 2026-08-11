---
'@backstage/plugin-app-react': minor
---

**BREAKING**: Removed `RouterBlueprint`. The new frontend system now has one browser-history authority and no longer supports replacing the router at the app root.

Remove overrides that only installed `BrowserRouter`. Move global providers to `AppRootWrapperBlueprint`, and attach alternate routers to individual pages or sub-pages with `PageRouterBlueprint`. This does not change the old frontend system's `components.Router` option.
