---
'@backstage/core-app-api': major
'@backstage/test-utils': minor
'@backstage/dev-utils': minor
---

Changed `BackstageApp.createRoot()` to return an object with a render method that operates how `BackstageApp.createRoot()` used to function.

```diff
// packages/app/src/App.tsx
const routes = (
   </FlatRoutes>
 );

-export default app.createRoot(
+export default app.createRoot().render(
   <>
     <AlertDisplay transientTimeoutMs={2500} />
     <OAuthRequestDialog />
```
