---
'@backstage/create-app': patch
---

Migrated the app template use the new `withDefaults` to construct the `createApp` options, as not doing this has been deprecated and will need to be done in the future.

To migrate an existing application, make the following change to `packages/app/src/App.tsx`:

```diff
+import { withDefaults } from '@backstage/core-components';

 // ...

-const app = createApp({
+const app = createApp(withDefaults({
   apis,
   bindRoutes({ bind }) {
     ...
   },
-});
+}));
```
