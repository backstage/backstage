## Toolkit backend

Welcome to the toolkit backend plugin!

_This plugin was created through the Backstage CLI_

## Features

1. API to get the list of all tools.
2. API to create, update, and delete your tool and add other's tools that are public.
3. Public tools are visible to all the members throughout the application and a private tool is visible to its creator only.
4. All the tools are user-specific.
5. APIs to manage the tools.

## Setup

The following sections will help you set up the toolkit backend plugin.

### Install the package

```bash
# From your Backstage root directory
yarn add --cwd packages/backend @backstage/plugin-toolkit-backend
```

### Adding the plugin to your `packages/backend`

You'll need to add the plugin to the router in your `backend` package. You can
do this by creating a file called `packages/backend/src/plugins/toolkit.ts`. An example for `toolkit.ts`` could be something like this.

```ts
import { createRouter } from '@backstage/plugin-toolkit-backend';
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

With the `toolkit.ts` router setup in place, add the router to
`packages/backend/src/index.ts`:

```diff
+import toolkit from './plugins/toolkit';

 async function main() {
   ...
   const createEnv = makeCreateEnv(config);

+    const toolkitEnv = useHotMemoize(module, () => createEnv('toolkit'));

   const apiRouter = Router();
+    apiRouter.use('/toolkit', await toolkit(toolkitEnv));
   ...
   apiRouter.use(notFoundHandler());
 }
```

## Database

To manage the tools we have used `PostgreSQL` as a database along with knex. which is used to create queries using Javascript syntax and translate our syntax into the appropriate SQL query.

## Getting started

Your plugin has been added to the example app in this repository, meaning you'll be able to access it by running the `yarn start backend` in the root directory.
