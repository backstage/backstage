# Linguist Backend

Welcome to the Linguist backend plugin! This plugin provides data for the Linguist frontend features.

## Setup

The following sections will help you get the Linguist Backend plugin setup and running.

### Up and Running

Here's how to get the backend up and running:

1. First we need to add the `@backstage/plugin-linguist-backend` package to your backend:

   ```sh
   # From the Backstage root directory
   cd packages/backend
   yarn add @backstage/plugin-linguist-backend
   ```

2. Then we will create a new file named `packages/backend/src/plugins/linguist.ts`, and add the
   following to it:

   ```ts
   import { TaskScheduleDefinition } from '@backstage/backend-tasks';
   import { createRouter } from '@backstage/plugin-linguist-backend';
   import { Router } from 'express';
   import type { PluginEnvironment } from '../types';

   export default async function createPlugin(
     env: PluginEnvironment,
   ): Promise<Router> {
     const schedule: TaskScheduleDefinition = {
       frequency: { hours: 24 },
       timeout: { minutes: 30 },
       initialDelay: { seconds: 90 },
     };

     return createRouter({
       logger: env.logger,
       config: env.config,
       reader: env.reader,
       discovery: env.discovery,
       database: env.database,
       scheduler: env.scheduler,
       schedule: schedule,
     });
   }
   ```

3. Next we wire this into the overall backend router, edit `packages/backend/src/index.ts`:

   ```ts
   import linguist from './plugins/linguist';
   // ...
   async function main() {
     // ...
     // Add this line under the other lines that follow the useHotMemoize pattern
     const linguistEnv = useHotMemoize(module, () => createEnv('linguist'));
     // ...
     // Insert this line under the other lines that add their routers to apiRouter in the same way
     apiRouter.use('/linguist', await linguist(linguistEnv));
   ```

4. Now run `yarn start-backend` from the repo root
5. Finally open `http://localhost:7007/api/linguist/health` in a browser and it should return `{"status":"ok"}`

## Scheduling

The Linguist backend can be configured to generate the language breakdown for all the entities with the linguist annotation. This is done by passing a `TaskScheduleDefinition` to the `createRouter` function like in Step 2 of the [Up and Running](#up-and-running) documentation.

Here's another example of the `TaskScheduleDefinition` that will run the language breakdown processing every 12 hours:

```ts
const schedule: TaskScheduleDefinition = {
  frequency: { hours: 12 },
  timeout: { minutes: 15 },
  initialDelay: { seconds: 10 },
};
```

The default setup will only generate the language breakdown for entities with the linguist annotation that have not been generated yet. If you want this process to also refresh the data you can do so by adding the following configuration to your `app-config.yaml`:

```yaml
linguist:
  age: 15 # Days
```

With the configuration setup like this if the language breakdown is older than 15 days it will get regenerated. It's recommended that if you choose to use this configuration to set it to a large value - 30, 90, or 180 - as this data generally does not change drastically.

## Links

- [Frontend part of the plugin](../linguist/README.md)
- [The Backstage homepage](https://backstage.io)
