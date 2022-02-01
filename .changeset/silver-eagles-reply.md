---
'@backstage/create-app': patch
---

Permission the `catalog-import` route

The following changes are **required** if you intend to add permissions to your existing app.

Use the `PermissionedRoute` for `CatalogImportPage` instead of the normal `Route`:

```diff
// packages/app/src/App.tsx
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
