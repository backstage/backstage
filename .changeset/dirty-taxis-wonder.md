---
'@backstage/plugin-techdocs-backend': patch
---

The techdocs plugin can now make use of the new `IdentityApi` to retrieve the user token.

To uptake this change you will need to edit `packages/backend/src/plugins/techdocs.ts` and add the identity option.

```typescript
export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  ...
  return await createRouter({
    preparers,
    generators,
    publisher,
    logger: env.logger,
    config: env.config,
    discovery: env.discovery,
    cache: env.cache,
    identity: env.identity,
  });
```
