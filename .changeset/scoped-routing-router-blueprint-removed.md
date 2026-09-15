---
'@backstage/plugin-app-react': minor
---

**BREAKING**: Removed `RouterBlueprint`. Remove overrides that only install `BrowserRouter`, move global providers to `AppRootWrapperBlueprint`, and render routing adapters inside lazily loaded page components.

For custom navigation, provide `AppHistoryApi` through an `ApiBlueprint` factory for `appHistoryApiRef` that is available during initialization without an `if` predicate. See the [app migration guide](https://backstage.io/docs/frontend-system/building-apps/migrating#components).
