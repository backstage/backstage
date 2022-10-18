# Azure Sites Backend

Simple plugin that proxies requests to the Azure Portal API through Azure SDK JavaScript libraries.

_Inspired by [roadie.io AWS Lamda plugin](https://roadie.io/backstage/plugins/aws-lambda/)_

## Setup

The following sections will help you get the Azure Sites Backend plugin setup and running.

### Configuration

The Azure plugin requires the following YAML to be added to your app-config.yaml:

```yaml
azureSites:
  domain:
  tenantId:
  clientId:
  clientSecret:
  allowedSubscriptions:
    - id:
```

Configuration Details:

- `domain` can be found by visiting the [Directories + Subscriptions settings page](https://portal.azure.com/#settings/directory). Alternatively you can inspect the [Azure home](https://portal.azure.com/#home) URL - `https://portal.azure.com/#@<Your_Domain>/`.
- `tenantId` can be found by visiting [Azure Directory Overview page](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade).
- (Optional) `clientId` and `clientSecret` can be the same values you used for [Azure DevOps Backend](https://github.com/backstage/backstage/tree/master/plugins/azure-devops-backend) or [Azure Integration](https://backstage.io/docs/integrations/azure/org#app-registration) as long as this App Registration has permissions to read your function apps.
- (Optional) `allowedSubscriptions` is an array of `id` that will be used to iterate over and look for the specified functions' app. `id` can be found the [Subscriptions page](https://portal.azure.com/#view/Microsoft_Azure_Billing/SubscriptionsBlade).

### Integrating

Here's how to get the backend plugin up and running:

1. First we need to add the `@backstage/plugin-azure-sites-backend` package to your backend:

   ```sh
   # From the Backstage root directory
   yarn add --cwd packages/backend @backstage/plugin-azure-sites-backend
   ```

2. Then we will create a new file named `packages/backend/src/plugins/azure.ts`, and add the following to it:

   ```ts
   import {
     createRouter,
     AzureSitesApi,
   } from '@backstage/plugin-azure-sites-backend';
   import { Router } from 'express';
   import { PluginEnvironment } from '../types';

   export default async function createPlugin(
     env: PluginEnvironment,
   ): Promise<Router> {
     return await createRouter({
       logger: env.logger,
       azureSitesApi: AzureSitesApi.fromConfig(env.config),
     });
   }
   ```

3. Next we wire this into the overall backend router, edit `packages/backend/src/index.ts`:

   ```ts
   import azure from './plugins/azure';

   // Removed for clairty...

   async function main() {
     // ...
     // Add this line under the other lines that follow the useHotMemoize pattern
     const azureSitesEnv = useHotMemoize(module, () =>
       createEnv('azure-sites'),
     );

     // ...
     // Insert this line under the other lines that add their routers to apiRouter in the same way
     apiRouter.use('/azure-sites', await azure(azureSitesEnv));
   }
   ```

4. Now run `yarn start-backend` from the repo root.

5. Finally, open `http://localhost:7007/api/azure/health` in a browser, it should return `{"status":"ok"}`.
