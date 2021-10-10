---
'@backstage/create-app': patch
---

The Backstage Search Platform's indexing process has been rewritten as a stream
pipeline in order to improve efficiency and performance on large document sets.

To take advantage of this, upgrade to the latest version of
`@backstage/plugin-search-backend-node`, as well as any backend plugins whose
collators you are using. Then, make the following changes to your
`/packages/backend/src/plugins/search.ts` file:

```diff
-import { DefaultCatalogCollator } from '@backstage/plugin-catalog-backend';
-import { DefaultTechDocsCollator } from '@backstage/plugin-techdocs-backend';
+import { DefaultCatalogCollatorFactory } from '@backstage/plugin-catalog-backend';
+import { DefaultTechDocsCollatorFactory } from '@backstage/plugin-techdocs-backend';

// ...

  const indexBuilder = new IndexBuilder({ logger, searchEngine });

  indexBuilder.addCollator({
    defaultRefreshIntervalSeconds: 600,
-    collator: DefaultCatalogCollator.fromConfig(config, { discovery }),
+    factory: DefaultCatalogCollatorFactory.fromConfig(config, { discovery }),
  });

  indexBuilder.addCollator({
    defaultRefreshIntervalSeconds: 600,
-    collator: DefaultTechDocsCollator.fromConfig(config, {
+    factory: DefaultTechDocsCollatorFactory.fromConfig(config, {
      discovery,
      logger,
    }),
  });
```

If you've written custom collators, decorators, or search engines in your
Backstage backend instance, you will need to re-implement them as readable,
transform, and writable streams respectively (including factory classes for
instantiating them).
