# Airbrake

The Airbrake plugin provides connectivity between Backstage and Airbrake (https://airbrake.io/).

## How to use

1. Install the Frontend plugin:

   ```bash
   # From your Backstage root directory
   yarn --cwd packages/app add @backstage/plugin-airbrake
   ```

2. Install the Backend plugin:

   ```bash
   # From your Backstage root directory
   yarn --cwd packages/backend add @backstage/plugin-airbrake-backend
   ```

3. Add the `EntityAirbrakeContent` and `isAirbrakeAvailable` to `packages/app/src/components/catalog/EntityPage.tsx` for all the entity pages you want Airbrake to be in:

   ```typescript jsx
   import {
     EntityAirbrakeContent,
     isAirbrakeAvailable,
   } from '@backstage/plugin-airbrake';

   const serviceEntityPage = (
     <EntityLayoutWrapper>
       <EntityLayout.Route
         if={isAirbrakeAvailable}
         path="/airbrake"
         title="Airbrake"
       >
         <EntityAirbrakeContent />
       </EntityLayout.Route>
     </EntityLayoutWrapper>
   );

   const websiteEntityPage = (
     <EntityLayoutWrapper>
       <EntityLayout.Route
         if={isAirbrakeAvailable}
         path="/airbrake"
         title="Airbrake"
       >
         <EntityAirbrakeContent />
       </EntityLayout.Route>
     </EntityLayoutWrapper>
   );

   const defaultEntityPage = (
     <EntityLayoutWrapper>
       <EntityLayout.Route
         if={isAirbrakeAvailable}
         path="/airbrake"
         title="Airbrake"
       >
         <EntityAirbrakeContent />
       </EntityLayout.Route>
     </EntityLayoutWrapper>
   );
   ```

4. Create `packages/backend/src/plugins/airbrake.ts` with these contents:

   ```typescript
   import { Router } from 'express';
   import { PluginEnvironment } from '../types';
   import {
     createRouter,
     extractAirbrakeConfig,
   } from '@backstage/plugin-airbrake-backend';

   export default async function createPlugin(
     env: PluginEnvironment,
   ): Promise<Router> {
     return createRouter({
       logger: env.logger,
       airbrakeConfig: extractAirbrakeConfig(env.config),
     });
   }
   ```

5. Setup the Backend code in `packages/backend/src/index.ts`:

   ```typescript
   import airbrake from './plugins/airbrake';

   async function main() {
     //... After const createEnv = makeCreateEnv(config) ...

     const airbrakeEnv = useHotMemoize(module, () => createEnv('airbrake'));

     //... After const apiRouter = Router() ...
     apiRouter.use('/airbrake', await airbrake(airbrakeEnv));
   }
   ```

6. Add this config as a top level section in your `app-config.yaml`:

   ```yaml
   airbrake:
     apiKey: ${AIRBRAKE_API_KEY}
   ```

7. Set an environment variable `AIRBRAKE_API_KEY` with your [API key](https://airbrake.io/docs/api/#authentication)
   before starting Backstage backend.

8. Add the following annotation to the `catalog-info.yaml` for a repo you want to link to an Airbrake project:

   ```yaml
   metadata:
     annotations:
       airbrake.io/project-id: '123456'
   ```

#### New Backend System

The Airbrake backend plugin has support for the [new backend system](https://backstage.io/docs/backend-system/), here's how you can set that up:

In your `packages/backend/src/index.ts` make the following changes:

```diff
  import { createBackend } from '@backstage/backend-defaults';
+ import { airbrakePlugin } from '@backstage/plugin-airbrake-backend';
  const backend = createBackend();
  // ... other feature additions
+ backend.add(airbrakePlugin());
  backend.start();
```

## Local Development

Start this plugin in standalone mode by running `yarn start` inside the plugin directory. This method of serving the plugin provides quicker
iteration speed and a faster startup and hot reloads. It is only meant for local development, and the setup for it can
be found inside the [/dev](./dev) directory.

> A mock API will be used to run it in standalone. If you want to talk to the real API [follow the instructions to start up Airbrake Backend in standalone](../airbrake-backend/README.md#local-development).
