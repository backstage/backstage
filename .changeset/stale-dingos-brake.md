---
'@backstage/plugin-permission-react': minor
---

**BREAKING** Replace PermissionedRoute with RequirePermission

Due to React Router no longer rendering non-`Route` children in v6,
`PermissionedRoute` will no longer function. Thus, we replace
`PermissionedRoute` with a `RequirePermission` component which can additionally
be used more broadly to gate any arbitrary children from rendering with an
authorization check. (This is [the recommended approach by React
Router](https://github.com/remix-run/react-router/issues/8092).)

```diff
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
