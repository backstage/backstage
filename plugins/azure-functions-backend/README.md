# Azure Functions Backend

Simple plugin that proxies requests to the Azure Portal API through Azure SDK JavaScript libraries.

_Inspired by [roadie.io AWS Lamda plugin](https://roadie.io/backstage/plugins/aws-lambda/)_

## Setup

The following sections will help you get the Azure Functions Backend plugin setup and running.

### Configuration

The Azure Functions plugin requires the following YAML to be added to your app-config.yaml:

```yaml
azureFunctions:
  domain:
  tenantId:
  clientId:
  clientSecret:
  allowedSubscriptions:
    - id:
      name:
```

Configuration Details:

- `domain` can be found by visiting the [Directories + Subscriptions settings page](https://portal.azure.com/#settings/directory). Alternatively you can inspect the [Azure home](https://portal.azure.com/#home) URL - `https://portal.azure.com/#@<Your_Domain>/`.
- `tenantId` can be found by visiting [Azure Directory Overview page](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade).
- `clientId` and `clientSecret` can be the same values you used for [Azure DevOps Backend](https://github.com/backstage/backstage/tree/master/plugins/azure-devops-backend) or [Azure Integration](https://backstage.io/docs/integrations/azure/org#app-registration) as long as this App Registration has permissions to read your function apps.
- `allowedSubscriptions` is an array of `id` and `name` that will be used to iterate over and look for the specified functions' app. `id` and `name` can be found the [Subscriptions page](https://portal.azure.com/#view/Microsoft_Azure_Billing/SubscriptionsBlade).

### Integrating

Here's how to get the backend plugin up and running:

1. First we need to add the `@backstage/plugin-azure-functions-backend` package to your backend:

   ```sh
   # From the Backstage root directory
   cd packages/backend
   yarn add @backstage/plugin-azure-functions-backend
   ```

2. Then we will create a new file named `packages/backend/src/plugins/azure-functions.ts`, and add the following to it:

   ```ts
   import {
     createRouter,
     AzureWebManagementApi,
   } from '@backstage/plugin-azure-functions-backend';
   import { Router } from 'express';
   import { PluginEnvironment } from '../types';

   export default async function createPlugin(
     env: PluginEnvironment,
   ): Promise<Router> {
     return await createRouter({
       logger: env.logger,
       azureWebManagementApi: AzureWebManagementApi.fromConfig(env.config),
     });
   }
   ```

3. Next we wire this into the overall backend router, edit `packages/backend/src/index.ts`:

   ```ts
   import azureFunctions from './plugins/azure-functions';

   // Removed for clairty...

   async function main() {
     // ...
     // Add this line under the other lines that follow the useHotMemoize pattern
     const azureFunctionsEnv = useHotMemoize(module, () =>
       createEnv('azureFunctions'),
     );

     // ...
     // Insert this line under the other lines that add their routers to apiRouter in the same way
     apiRouter.use('/azure-functions', await azureFunctions(azureFunctionsEnv));
   }
   ```

4. Now run `yarn start-backend` from the repo root.

5. Finally, open `http://localhost:7007/api/azure-functions/health` in a browser, it should return `{"status":"ok"}`.
