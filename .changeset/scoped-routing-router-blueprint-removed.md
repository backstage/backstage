---
'@backstage/plugin-app-react': minor
---

**BREAKING**: Removed `RouterBlueprint` and the `router` input on `app/root`. The new frontend system uses one app history, and pages declare adapters for their routing libraries.

Remove overrides that only installed `BrowserRouter`. Move global providers to `AppRootWrapperBlueprint`, and render an adapter such as `ReactRouterV6PageRouter` inside the lazily loaded component of each page that needs it.

Apps with custom navigation can provide `AppHistoryApi` through an `ApiBlueprint` factory for `appHistoryApiRef`. This replaces the default browser history; the factory must be available during initialization and cannot depend on an `if` predicate. The old frontend system's `components.Router` option is unchanged.
