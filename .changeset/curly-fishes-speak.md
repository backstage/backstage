---
'@backstage/create-app': patch
---

(fix) Adds locationAnalyzer to default-app template

The locationAnalyzer was missing from the default-app template.
This resulted in 404 errors in newly bootstrapped backstage applications,
when adding components without configuration.

To fix this in an existing backstage application, the locationAnalyzer needs
to be carried from the builder to the router in the
`packages/backend/src/plugins/catalog.ts` file.

```diff
   const builder = new CatalogBuilder(env);
   const {
     entitiesCatalog,
     locationsCatalog,
     higherOrderOperation,
+    locationAnalyzer,
   } = await builder.build();
   // ...
   return await createRouter({
     entitiesCatalog,
     locationsCatalog,
     higherOrderOperation,
+    locationAnalyzer,
     logger: env.logger,
   });
```
