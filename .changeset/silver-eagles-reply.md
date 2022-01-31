---
'@backstage/create-app': patch
---

Permission the catalog-import route

Use the `PermissionedRoute` for `CatalogImportPage` instead of the normal `Route`:

```diff
// app/src/App.tsx
...
+ import { PermissionedRoute } from '@backstage/plugin-permission-react';
+ import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common';

...

- <Route path="/catalog-import" element={<CatalogImportPage />} />
+ <PermissionedRoute
+   path="/catalog-import"
+   permission={catalogEntityCreatePermission}
+   element={<CatalogImportPage />}
+ />
```
