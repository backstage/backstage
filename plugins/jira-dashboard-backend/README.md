# Jira Dashboard Backend

A plugin that makes requests to [Atlassian REST API](https://developer.atlassian.com/server/jira/platform/rest-apis/) to get issues and project information from Jira.

The frontend plugin that displays this information is [Jira Dashboard](https://github.com/backstage/backstage/tree/master/plugins/jira-dashboard).

## Setup

The following sections will help you get the Jira Dashboard Backend plugin setup and running.

### Installation

Install the plugin by following the example below:

```bash
# From your Backstage root directory
yarn add --cwd packages/backend @backstage/plugin-jira-dashboard-backend
```

### Configuration

The Jira Dashboard plugin requires the following YAML to be added to your app-config.yaml:

```yaml
jiraDashboard:
  token: ${JIRA_TOKEN}
  baseUrl: ${JIRA_BASE_URL}'
  userEmailSuffix: ${JIRA_EMAIL_SUFFIX}'
```

Configuration Details:

- `JIRA_TOKEN`: The API token to authenticate towards Jira. It can be found by visiting Atlassians page at https://developer.atlassian.com/cloud/jira/platform/basic-auth-for-rest-apis/. In case you are using a Bearer or Basic token, you need to add it in the beginning of the token. For instance: `Bearer your-secret-token`
- `JIRA_BASE_URL`: The base url for Jira in your company, including the API version. For instance: https://jira.se.your-company.com/rest/api/2/'
- `JIRA_EMAIL_SUFFIX`: The email suffix used for retrieving a specific Jira user in a company. For instance: @your-company.com

### Integrating

Here's how to get the backend plugin up and running:

1. Create a new file named `packages/backend/src/plugins/jiraDashboard.ts`, and add the following to it:

   ```ts
   import { createRouter } from '@backstage/plugin-jira-dashboard-backend';
   import { Router } from 'express';
   import { PluginEnvironment } from '../types';

   export default async function createPlugin(
     env: PluginEnvironment,
   ): Promise<Router> {
     return await createRouter({
       logger: env.logger,
       config: env.config,
       discovery: env.discovery,
       identity: env.identity,
       tokenManager: env.tokenManager,
     });
   }
   ```

2. Wire this into the overall backend router by adding the following to `packages/backend/src/index.ts`:

   ```ts
   import jiraDashboard from './plugins/jiraDashboard';
   ...

   async function main() {
     // Add this line under the other lines that follow the useHotMemoize pattern
    const jiraDashboardEnv = useHotMemoize(module, () => createEnv('jira-dashboard'),

     // Add this under the lines that add their routers to apiRouter
    apiRouter.use('/jira-dashboard', await jiraDashboard(jiraDashboardEnv));
   }
   ```

3. Now run `yarn start-backend` from the repo root.

4. In another terminal, run the command: `curl localhost:7007/api/jira-dashboard/health`. The request should return `{"status":"ok"}`.

### New Backend System

The Jira Dashboard backend plugin has support for the [new backend system](https://backstage.io/docs/backend-system/). Here is how you can set it up:

In your `packages/backend/src/index.ts` make the following changes:

```diff
+ import { jiraDashboardPlugin } from '@backstage/plugin-jira-dashboard-backend';

const backend = createBackend();
+ backend.add(jiraDashboardPlugin());
// ... other feature additions

backend.start();
```
