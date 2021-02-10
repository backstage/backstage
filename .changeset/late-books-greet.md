---
'@backstage/plugin-catalog-import': minor
---

The plugin has been refactored and is now based on a configurable state machine of 'analyze', 'prepare', 'review' & 'finish'.
Depending on the outcome of the 'analyze' stage, different flows are selected ('single-location', 'multiple-locations', 'no-location').
Each flow can define it's own components that guide the user.

During the refactoring, the `catalogRouteRef` property of the `CatalogImportPage` has been removed, so the `App.tsx` of the backstage apps need to be updated:

```diff
// packages/app/src/App.tsx

     <Route
       path="/catalog-import"
-      element={<CatalogImportPage catalogRouteRef={catalogRouteRef} />}
+      element={<CatalogImportPage />}
     />
```
