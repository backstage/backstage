---
'@backstage/plugin-app-react': minor
---

**BREAKING**: Removed `RouterBlueprint`; remove overrides that only install `BrowserRouter`, move global providers to `AppRootWrapperBlueprint`, and render routing adapters inside lazily loaded page components. For custom navigation, provide `AppHistoryApi` through an `ApiBlueprint` factory for `appHistoryApiRef` that is available during initialization without an `if` predicate. See the [1.57 migration notes](https://backstage.io/docs/frontend-system/architecture/migrations#157) for detailed migration steps.
