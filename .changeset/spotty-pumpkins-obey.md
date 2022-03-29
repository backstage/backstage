---
'@backstage/create-app': minor
---

Replace PermissionedRoute with RequirePermission

`@backstage/plugin-permission-react` has replaced the `PermissionedRoute`
component with the `RequirePermission` component (see the
`@backstage/plugin-permission-react` changelog for details). Any
`PermissionedRoute`s can be replaced with `RequirePermission` as shown below:

```diff
// packages/app/src/App.tsx

- import { PermissionedRoute } from '@backstage/plugin-permission-react';
+ import { RequirePermission } from '@backstage/plugin-permission-react';

- <PermissionedRoute
-   path="/catalog-import"
-   permission={catalogEntityCreatePermission}
-   element={<CatalogImportPage />}
- />
+ <Route
+   path="/catalog-import"
+   element={
+     <RequirePermission permission={catalogEntityCreatePermission}>
+       <CatalogImportPage />
+     </RequirePermission>
+   }
+ />
```
