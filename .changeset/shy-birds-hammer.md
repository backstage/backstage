---
'@backstage/create-app': patch
---

Updated the app template to use the new `AppRouter` component instead of `app.getRouter()`.

To apply this change to an existing app, make the following change to `packages/app/src/App.tsx`:

```diff
-import { FlatRoutes } from '@backstage/core-app-api';
+import { AppRouter, FlatRoutes } from '@backstage/core-app-api';

 ...

 const AppProvider = app.getProvider();
-const AppRouter = app.getRouter();
```
