# DevTools Backend

Welcome to the DevTools backend plugin! This plugin provides data for the [DevTools frontend](../devtools/) features.

## Setup

Here's how to get the DevTools Backend up and running:

1. First we need to add the `@backstage/plugin-devtools-backend` package to your backend:

   ```sh
   # From the Backstage root directory
   cd packages/backend
   yarn add @backstage/plugin-devtools-backend
   ```

2. Then we will create a new file named `packages/backend/src/plugins/devtools.ts`, and add the
   following to it:

   ```ts
   import { createRouter } from '@backstage/plugin-devtools-backend';
   import { Router } from 'express';
   import type { PluginEnvironment } from '../types';

   export default function createPlugin(
     env: PluginEnvironment,
   ): Promise<Router> {
     return createRouter({
       logger: env.logger,
       config: env.config,
       permissions: env.permissions,
     });
   }
   ```

3. Next we wire this into the overall backend router, edit `packages/backend/src/index.ts`:

   ```ts
   import devTools from './plugins/devtools';
   // ...
   async function main() {
     // ...
     // Add this line under the other lines that follow the useHotMemoize pattern
     const devToolsEnv = useHotMemoize(module, () => createEnv('devtools'));
     // ...
     // Insert this line under the other lines that add their routers to apiRouter in the same way
     apiRouter.use('/devtools', await devTools(devToolsEnv));
   ```

4. Now run `yarn start-backend` from the repo root
5. Finally open `http://localhost:7007/api/devtools/health` in a browser and it should return `{"status":"ok"}`

## Adding scheduled tasks

To add the scheduled tasks, the plugin task schedulers from other plugins, such as search and catalog, need to be passed
to the DevTools plugin. Modify your `packages/backend/src/plugins/devtools.ts` as follows:

```ts
import { createRouter } from '@backstage/plugin-devtools-backend';
import { Router } from 'express';
import type { PluginEnvironment } from '../types';
import { PluginTaskScheduler } from '@backstage/backend-tasks';

export default function createPlugin(
  env: PluginEnvironment,
  taskSchedulers?: PluginTaskScheduler[],
): Promise<Router> {
  return createRouter({
    logger: env.logger,
    config: env.config,
    permissions: env.permissions,
    taskSchedulers,
  });
}
```

And in the `packages/backend/src/index.ts` pass the wanted schdulers to the plugin:

```ts
import devTools from './plugins/devtools';
// ...
async function main() {
  // ...
  const devToolsEnv = useHotMemoize(module, () => createEnv('devtools'));
  // ...
  apiRouter.use('/search', await search(searchEnv));
  apiRouter.use('/devtools', await devTools(devToolsEnv, [searchEnv.scheduler]));
```

## Links

- [Frontend part of the plugin](../devtools/README.md)
- [The Backstage homepage](https://backstage.io)
