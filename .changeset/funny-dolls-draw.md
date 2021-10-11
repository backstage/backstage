---
'@backstage/create-app': patch
---

The scaffolder plugin has just released the beta 3 version of software templates, which replaces the handlebars templating syntax. As part of this change, the template entity schema is no longer included in the core catalog-model as with previous versions. The decoupling of the template entities version will allow us to more easily make updates in the future.

In order to use the new beta 3 templates, the following changes are **required** for any existing installation, inside `packages/backend/src/plugins/catalog.ts`:

```diff
+import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';

...

   const builder = await CatalogBuilder.create(env);
+  builder.addProcessor(new ScaffolderEntitiesProcessor());
   const { processingEngine, router } = await builder.build();
```

If you're interested in learning more about creating custom kinds, please check out the [extending the model](https://backstage.io/docs/features/software-catalog/extending-the-model) documentation.
