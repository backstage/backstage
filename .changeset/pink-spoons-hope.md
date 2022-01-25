---
'@backstage/plugin-search-backend': minor
---

**BREAKING** Added three additional required properties to `createRouter` to support filtering search results based on permissions. To make this change to an existing app, add the required parameters to the `createRouter` call in `packages/backend/src/plugins/search.ts`:

```diff
export default async function createPlugin({
  logger,
+  permissions,
  discovery,
  config,
  tokenManager,
}: PluginEnvironment) {
  /* ... */

  return await createRouter({
    engine: indexBuilder.getSearchEngine(),
+    types: indexBuilder.getDocumentTypes(),
+    permissions,
+    config,
    logger,
  });
}
```
