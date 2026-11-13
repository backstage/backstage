---
'@backstage/plugin-app': minor
---

Pages and sub-pages now share app-owned navigation and can use different routing libraries, with implicit React Router v6 compatibility for existing pages. **BREAKING**: Removed the `router` input from `app/root`; remove root router extensions, move global providers to `AppRootWrapperBlueprint`, and use page adapters where needed. See the [1.57 migration notes](https://backstage.io/docs/frontend-system/architecture/migrations#157) for detailed migration steps.
