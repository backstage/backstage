# Onboarding backend

Welcome to the onboarding backend plugin!

_This plugin was created through the Backstage CLI_

## Features

1. API to sync the database with a GitHub repository.
2. API to fetch all the checklists from DB to present them on UI.
3. API to update the status of checklists.
4. All the checklists are group/team specific.
5. APIs to manage the checklists.

## Setup

The following sections will help you set up the onboarding backend plugin.

### Install the package

```bash
# From your Backstage root directory
yarn add --cwd packages/backend @backstage/plugin-onboarding-backend
```

### Adding the plugin to your `packages/backend`

You'll need to add the plugin to the router in your `backend` package. You can
do this by creating a file called `packages/backend/src/plugins/onboarding.ts`. An example of `onboarding.ts`` could be something like this.

```ts
import { createRouter } from '@backstage/plugin-onboarding-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    database: env.database,
    logger: env.logger,
    config: env.config,
    identity: env.identity,
  });
}
```

With the `onboarding.ts` router setup in place, add the router to
`packages/backend/src/index.ts`:

```diff
+import onboarding from './plugins/onboarding';
 async function main() {
   ...
   const createEnv = makeCreateEnv(config);s
+    const onboardingEnv = useHotMemoize(module, () => createEnv('onboarding'));
   const apiRouter = Router();
+    apiRouter.use('/onboarding', await onboarding(onboardingEnv));
   ...
   apiRouter.use(notFoundHandler());
 }
```

## Database

To manage the checklists we have used `PostgreSQL` as a database along with Knex. which is used to create queries using Javascript syntax and translate our syntax into the appropriate SQL query.

## Getting started

Your plugin has been added to the onboarding app in this repository, meaning you'll be able to access it by running `yarn
start` in the root directory, and then navigate to [/](http://localhost:3000/onboarding)onboarding](http://localhost:3000/onboarding).

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
