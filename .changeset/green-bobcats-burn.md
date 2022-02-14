---
'@backstage/plugin-permission-backend': minor
---

Add a warning if the permission backend is used without setting `permission.enabled=true`.

**BREAKING** Permission backend's `createRouter` now requires a `config` option.

```diff
// packages/backend/src/plugins/permission.ts

...
export default async function createPlugin({
  ...
+ config,
}: PluginEnvironment) {
  return createRouter({
    ...
+   config,
  });
}
```
