---
'@backstage/plugin-catalog-backend': patch
---

Expose a list of the default processors to enable fine-grained configuration

You can now use the exposed method `defaultProcessors(env:CatalogEnvironment):CatalogProcessor[]`
when you need to configure one of the default catalog processors, but still want
to enable all default processors without explicitly initiate them.

```typescript
const builder = new CatalogBuilder(env);
const processors = defaultProcessors(env);

// Replace or change one or several of the default processors

builder.replaceProcessors(processors);
// ...
const {
  entitiesCatalog,
  locationsCatalog,
  higherOrderOperation,
} = await builder.build();
```
