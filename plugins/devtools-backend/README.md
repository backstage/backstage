# DevTools Backend

Welcome to the DevTools backend plugin! This plugin provides data for the [DevTools frontend](../devtools/) features.

## Setup

Here's how to get the DevTools Backend up and running in the new backend system:

1. First we need to add the `@backstage/plugin-devtools-backend` package to your backend:

   ```sh
   # From the Backstage root directory
   yarn --cwd packages/backend add @backstage/plugin-devtools-backend
   ```

2. Then add the plugin to your backend index file:

   ```ts
   // In packages/backend/src/index.ts
   const backend = createBackend();
   // ... other feature additions
   backend.add(import('@backstage/plugin-devtools-backend'));
   ```

3. Now run `yarn start-backend` from the repo root
4. Finally open `http://localhost:7007/api/devtools/health` in a browser and it should return `{"status":"ok"}`

## Old Backend System

If you are still on the old backend system, please consider migrating to the new backend system. But to install this plugin in an old backend, see below.

1. First we need to add the `@backstage/plugin-devtools-backend` package to your backend:

   ```sh
   # From the Backstage root directory
   yarn --cwd packages/backend add @backstage/plugin-devtools-backend
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
       discovery: env.discovery,
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

## Links

- [Frontend part of the plugin](https://github.com/backstage/backstage/tree/master/plugins/devtools)
- [The Backstage homepage](https://backstage.io)
