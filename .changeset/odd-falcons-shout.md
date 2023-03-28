---
'@backstage/plugin-catalog-backend': minor
---

The catalog now has a new, optional `catalog.orphanStrategy` app-config parameter, which can have the string values `'keep'` (default) or `'delete'`.

If set to `'keep'` or left unset, the old behavior is maintained of keeping orphaned entities around until manually deleted.

If set to `'delete'`, the catalog will attempt to automatically clean out orphaned entities without manual intervention. Note that there are no guarantees that this process is instantaneous, so there may be some delay before orphaned items disappear.

For context, the [Life of an Entity](https://backstage.io/docs/features/software-catalog/life-of-an-entity/#orphaning) article goes into some more details on how the nature of orphaning works.

To enable the new behavior, you will need to pass the plugin task scheduler to your catalog backend builder. If your code already looks like this, you don't need to change it:

```ts
// in packages/backend/src/plugins/catalog.ts
export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
```

But if you pass things into the catalog builder one by one, you'll need to add the new field:

```diff
 // in packages/backend/src/plugins/catalog.ts
   const builder = await CatalogBuilder.create({
     // ... other dependencies
+    scheduler: env.scheduler,
   });
```

Finally adjust your app-config:

```yaml
catalog:
  orphanStrategy: delete
```
