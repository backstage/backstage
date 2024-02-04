# Azure DevOps Backend

Simple plugin that proxies requests to the [Azure DevOps](https://docs.microsoft.com/en-us/rest/api/azure/devops/?view=azure-devops-rest-6.1) API.

## Setup

The following sections will help you get the Azure DevOps Backend plugin setup and running.

### Configuration

The Azure DevOps plugin requires the following YAML to be added to your `app-config.yaml`:

```yaml
azureDevOps:
  host: dev.azure.com
  token: ${AZURE_TOKEN}
  organization: my-company
```

Configuration Details:

- `host` and `token` can be the same as the ones used for the `integration` section
- `AZURE_TOKEN` environment variable must be set to a [Personal Access Token](https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=preview-page) with read access to both Code and Build
- `organization` is your Azure DevOps Services (cloud) Organization name or for Azure DevOps Server (on-premise) this will be your Collection name

#### Multi Organization & Service Principals

To support cases where you have multiple Azure DevOps organizations and/or you want to use a Service Principal you will want to make sure to configure them in the `integrations.azure` section of your `app-config.yaml` as detailed in the [Azure DevOps Locations](https://backstage.io/docs/integrations/azure/locations) documentation.

**Note:** You will still need to define the [configuration above](#configuration).

### Up and Running

Here's how to get the backend up and running:

1. First we need to add the `@backstage/plugin-azure-devops-backend` package to your backend:

   ```sh
   # From your Backstage root directory
   yarn --cwd packages/backend add @backstage/plugin-azure-devops-backend
   ```

2. Then we will create a new file named `packages/backend/src/plugins/azure-devops.ts`, and add the
   following to it:

   ```ts
   import { createRouter } from '@backstage/plugin-azure-devops-backend';
   import { Router } from 'express';
   import type { PluginEnvironment } from '../types';

   export default function createPlugin(
     env: PluginEnvironment,
   ): Promise<Router> {
     return createRouter({
       logger: env.logger,
       config: env.config,
       reader: env.reader,
     });
   }
   ```

3. Next we wire this into the overall backend router, edit `packages/backend/src/index.ts`:

   ```ts
   import azureDevOps from './plugins/azure-devops';
   // ...
   async function main() {
     // ...
     // Add this line under the other lines that follow the useHotMemoize pattern
     const azureDevOpsEnv = useHotMemoize(module, () => createEnv('azure-devops'));
     // ...
     // Insert this line under the other lines that add their routers to apiRouter in the same way
     apiRouter.use('/azure-devops', await azureDevOps(azureDevOpsEnv));
   ```

4. Now run `yarn start-backend` from the repo root
5. Finally open `http://localhost:7007/api/azure-devops/health` in a browser and it should return `{"status":"ok"}`

#### New Backend System

The Azure DevOps backend plugin has support for the [new backend system](https://backstage.io/docs/backend-system/), here's how you can set that up:

In your `packages/backend/src/index.ts` make the following changes:

```diff
  import { createBackend } from '@backstage/backend-defaults';
+ import { azureDevOpsPlugin } from '@backstage/plugin-azure-devops-backend';

  const backend = createBackend();

  // ... other feature additions

+ backend.add(azureDevOpsPlugin());

  backend.start();
```

## Processor

The Azure DevOps backend plugin includes the `AzureDevOpsAnnotatorProcessor` which will automatically add the needed annotations for you. Here's how to install it:

```diff
  import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
  import { ScaffolderEntitiesProcessor } from '@backstage/plugin-catalog-backend-module-scaffolder-entity-model';
  import { Router } from 'express';
  import { PluginEnvironment } from '../types';
+ import { AzureDevOpsAnnotatorProcessor } from '@backstage/plugin-azure-devops-backend';

  export default async function createPlugin(
    env: PluginEnvironment,
  ): Promise<Router> {
    const builder = await CatalogBuilder.create(env);
    builder.addProcessor(new ScaffolderEntitiesProcessor());
+   builder.addProcessor(AzureDevOpsAnnotatorProcessor.fromConfig(env.config));
    const { processingEngine, router } = await builder.build();
    await processingEngine.start();
    return router;
  }
```

To use this with the New Backend System you'll want to create a [backend module extension for the Catalog](https://backstage.io/docs/backend-system/building-backends/migrating#other-catalog-extensions) if you haven't already. Here's a basic example of this assuming you are only adding the `AzureDevOpsAnnotatorProcessor`, this would go in your `packages/backend/index.ts`:

```diff
   import { createBackend } from '@backstage/backend-defaults';
+  import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
+  import { coreServices, createBackendModule } from '@backstage/backend-plugin-api';
+  import { AzureDevOpsAnnotatorProcessor } from '@backstage/plugin-azure-devops-backend';

+  const catalogModuleCustomExtensions = createBackendModule({
+    pluginId: 'catalog', // name of the plugin that the module is targeting
+    moduleId: 'custom-extensions',
+    register(env) {
+      env.registerInit({
+        deps: {
+          catalog: catalogProcessingExtensionPoint,
+          config: coreServices.rootConfig,
+        },
+        async init({ catalog, config }) {
+          catalog.addProcessor(AzureDevOpsAnnotatorProcessor.fromConfig(config));
+        },
+      });
+    },
+  });

   const backend = createBackend();

   // ... other feature additions

+  backend.add(catalogModuleCustomExtensions());

   backend.start();
```

## Links

- [Frontend part of the plugin](https://github.com/backstage/backstage/tree/master/plugins/azure-devops)
- [The Backstage homepage](https://backstage.io)
