---
'@backstage/plugin-todo-backend': minor
---

Added support for authorizing access to TODOs using the permissions plugin.

This is a breaking change because `createRouter` now requires `permissions` option to be forwarded from the plugin environment in the backend setup.

To update your existing plugin setup, apply the following change to `packages/backend/src/plugins/todo.ts`:

```diff
 export default async function createPlugin({
   logger,
   reader,
   config,
   discovery,
+  permissions,
 }: PluginEnvironment): Promise<Router> {

 // ...

-  return await createRouter({ todoService });
+  return await createRouter({ todoService, permissions });
 }
```

Access to reading TODOs is granted based on the `'catalog.entity.read'` permission.
