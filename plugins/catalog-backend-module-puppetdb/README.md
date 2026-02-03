# Catalog Backend Module for Puppet

This is an extension module to the `plugin-catalog-backend` plugin, providing an `PuppetDbEntityProvider` that can be used to ingest
[Resource entities](https://backstage.io/docs/features/software-catalog/descriptor-format#kind-resource) from a
[PuppetDB](https://www.puppet.com/docs/puppet/6/puppetdb_overview.html) instance(s). This provider is useful if you want to import nodes
from your PuppetDB into Backstage.

## Installation

The provider is not installed by default, therefore you have to add a dependency to `@backstage/plugin-catalog-backend-module-puppetdb`
to your backend package:

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-catalog-backend-module-puppetdb
```

Update the catalog plugin initialization in your backend to add the provider and schedule it:

```diff
+ import { PuppetDbEntityProvider } from '@backstage/plugin-catalog-backend-module-puppetdb';

 export default async function createPlugin(
   env: PluginEnvironment,
 ): Promise<Router> {
   const builder = await CatalogBuilder.create(env);

+  builder.addEntityProvider(
+    PuppetDbEntityProvider.fromConfig(env.config, {
+      logger: env.logger,
+      schedule: env.scheduler.createScheduledTaskRunner({
+        frequency: { minutes: 10 },
+        timeout: { minutes: 50 },
+        initialDelay: { seconds: 15 }
+      }),
+    })
+  );
```

After this, you also have to add some configuration in your app-config that describes what you want to import for that target.

## Configuration

The following configuration is an example of how a setup could look for importing nodes from an internal PuppetDB instance:

```yaml
catalog:
  providers:
    puppetdb:
      default:
        # (Required) The base URL of PuppetDB API instance:
        baseUrl: https://puppetdb.example.com

        # (Optional) Query to filter PuppetDB nodes:
        #query: '["=","certname","example.com"]'
```

## Customize the Provider

The default ingestion behaviour will likely not work for all use cases - you will want to set proper `Owner`, `System` and other fields for the
ingested resources. In case you want to customize the ingested entities, the provider allows to pass a transformer for resources. Here we will show an example
of overriding the default transformer.

1. Create a transformer:

```ts
export const customResourceTransformer: ResourceTransformer = async (
  node,
  config,
): Promise<ResourceEntity | undefined> => {
  // Transformations may change namespace, owner, change entity naming pattern, add labels, annotations, etc.

  // Create the Resource Entity on your own, or wrap the default transformer
  return await defaultResourceTransformer(node, config);
};
```

2. Configure the provider with the transformer:

```diff
  builder.addEntityProvider(
    PuppetDbEntityProvider.fromConfig(env.config, {
      logger: env.logger,
+     transformer: customResourceTransformer,
      schedule: env.scheduler.createScheduledTaskRunner({
        frequency: { minutes: 10 },
        timeout: { minutes: 50 },
        initialDelay: { seconds: 15 }
      }),
    })
  );
```
