---
'@backstage/plugin-catalog-backend': minor
'@backstage/plugin-catalog-import': minor
'@backstage/catalog-model': patch
'@backstage/plugin-scaffolder': patch
---

Add Analyze location endpoint to catalog backend. Add catalog-import plugin and replace import-component with it. To start using Analyze location endpoint, you have add it to the `createRouter` function options in the `\backstage\packages\backend\src\plugins\catalog.ts` file:

```ts
export default async function createPlugin(env: PluginEnvironment) {
  const builder = new CatalogBuilder(env);
  const {
    entitiesCatalog,
    locationsCatalog,
    higherOrderOperation,
    locationAnalyzer, //<--
  } = await builder.build();

  return await createRouter({
    entitiesCatalog,
    locationsCatalog,
    higherOrderOperation,
    locationAnalyzer, //<--
    logger: env.logger,
  });
}
```
