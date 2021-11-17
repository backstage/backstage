---
'@backstage/create-app': patch
---

Migrated the app template use the new `@backstage/app-defaults` for the `createApp` import, since the `createApp` exported by `@backstage/app-core-api` will be removed in the future.

To migrate an existing application, add the latest version of `@backstage/app-defaults` as a dependency in `packages/app/package.json`, and make the following change to `packages/app/src/App.tsx`:

```diff
-import { createApp, FlatRoutes } from '@backstage/core-app-api';
+import { createApp } from '@backstage/app-defaults';
+import { FlatRoutes } from '@backstage/core-app-api';
```
