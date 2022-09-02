---
'@backstage/plugin-search-backend': patch
---

The search plugin can now make use of the new `IdentityApi` to retrieve the user token.

To uptake this change you will need to edit `packages/backend/src/plugins/search.ts` and add the identity option.

```typescript
export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  ...
  return await createRouter({
    engine: indexBuilder.getSearchEngine(),
    types: indexBuilder.getDocumentTypes(),
    permissions: env.permissions,
    config: env.config,
    logger: env.logger,
    identity: env.identity,
  });
}
```
