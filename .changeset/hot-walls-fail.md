---
'@backstage/create-app': patch
---

Migrated the app template to pass on explicit `components` to the `createApp` options, as not doing this has been deprecated and will need to be done in the future.

To migrate an existing application, make the following change to `packages/app/src/App.tsx`:

```diff
+import { defaultAppComponents } from '@backstage/core-components';

 // ...

 const app = createApp({
   apis,
+  components: defaultAppComponents(),
   bindRoutes({ bind }) {
```

If you already supply custom app components, you can use the following:

```diff

 // ...

 const app = createApp({
   apis,
  components: {
+     ...defaultAppComponents(),
    Progress: MyCustomProgressComponent,
   },
   bindRoutes({ bind }) {
```
