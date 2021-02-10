---
'@backstage/create-app': patch
---

`@backstage/plugin-catalog-import` has been refactored, so the `App.tsx` of the backstage apps need to be updated:

```diff
// packages/app/src/App.tsx

     <Route
       path="/catalog-import"
-      element={<CatalogImportPage catalogRouteRef={catalogRouteRef} />}
+      element={<CatalogImportPage />}
     />
```
