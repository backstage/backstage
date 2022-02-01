---
'@backstage/create-app': patch
---

Adds missing `/catalog-graph` route to `<CatalogGraphPage/>`.

To fix this problem for a recently created app please update your `app/src/App.tsx`

```diff
+ import { CatalogGraphPage } from '@backstage/plugin-catalog-graph';

 ... omitted ...

  </Route>
    <Route path="/settings" element={<UserSettingsPage />} />
+   <Route path="/catalog-graph" element={<CatalogGraphPage />} />
  </FlatRoutes>
```
