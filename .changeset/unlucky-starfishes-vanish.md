---
'@backstage/plugin-fossa': patch
---

Add a `FossaPage` that shows the license compliance status of all components in the catalog.
This is an optional component that can be registered as a route:

```diff
// packages/app/src/App.tsx

+  import { FossaPage } from '@backstage/plugin-fossa';

// ...

  const routes = (
    <FlatRoutes>
      // ...
+     <Route path="/fossa" element={<FossaPage />} />
    </FlatRoutes>
  );
```
