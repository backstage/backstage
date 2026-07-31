---
'@backstage/plugin-app-react': patch
---

Deprecated `RouterBlueprint`. Browser history in the new frontend system is now owned by the app, and each page picks the router that renders its content through `PageRouterBlueprint` / `pageRouterApiRef` from `@backstage/frontend-plugin-api`.

Existing overrides keep working and there is no removal date — React Router v6 remains supported — but new code should use a page-level router instead of replacing the app root router.
