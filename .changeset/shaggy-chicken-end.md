---
'@backstage/plugin-catalog-backend': patch
---

The catalog plugin can now make use of the new `IdentityApi` to retrieve the user token.

To uptake this change you will need to edit the `packages/backend/src/plugins/catalog.ts` and add the identity option when creating the CatalogBuilder.

```typescript
export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create({
    config: env.config,
    logger: env.logger,
    reader: env.reader,
    database: env.database,
    permissions: env.permissions,
    identity: env.identity,
  });
  builder.addProcessor(new ScaffolderEntitiesProcessor());
  const { processingEngine, router } = await builder.build();
  await processingEngine.start();
  return router;
}
```
