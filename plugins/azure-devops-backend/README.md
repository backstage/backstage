# Azure DevOps Backend

Simple plugin that proxies requests to the [Azure DevOps](https://docs.microsoft.com/en-us/rest/api/azure/devops/?view=azure-devops-rest-6.1) API.

## Setup

The following sections will help you get the Azure DevOps Backend plugin setup and running.

### Configuration

The Azure DevOps plugin requires the following YAML to be added to your app-config.yaml:

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

### Up and Running

Here's how to get the backend up and running:

1. First we need to add the `@backstage/plugin-azure-devops-backend` package to your backend:

   ```sh
   # From the Backstage root directory
   cd packages/backend
   yarn add @backstage/plugin-azure-devops-backend
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

## Links

- [Frontend part of the plugin](https://github.com/backstage/backstage/tree/master/plugins/azure-devops)
- [The Backstage homepage](https://backstage.io)
