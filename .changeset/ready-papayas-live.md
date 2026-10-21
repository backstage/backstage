---
'@backstage/frontend-plugin-api': patch
---

The `useRouteRef` hook now resolves the route again once the app has been finalized, so that elements rendered before finalization, such as `app/root.elements` extensions, can link to pages instead of getting `undefined`.
