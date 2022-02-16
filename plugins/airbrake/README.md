# Airbrake

The Airbrake plugin provides connectivity between Backstage and Airbrake (https://airbrake.io/).

## How to use

1. Install the Frontend plugin:

   ```bash
   # From your Backstage root directory
   cd packages/app
   yarn add @backstage/plugin-airbrake
   ```

2. Install the Backend plugin:

   ```bash
   # From your Backstage root directory
   cd packages/backend
   yarn add @backstage/plugin-airbrake-backend
   ```

3. Add the `EntityAirbrakeContent` to `packages/app/src/components/catalog/EntityPage.tsx`:

   ```typescript jsx
   import { EntityAirbrakeContent } from '@backstage/plugin-airbrake';

   const serviceEntityPage = (
     <EntityLayoutWrapper>
       <EntityLayout.Route path="/airbrake" title="Airbrake">
         <EntityAirbrakeContent />
       </EntityLayout.Route>
     </EntityLayoutWrapper>
   );
   ```

4. Setup the Backend code in `packages/backend/src/index.ts`:

   ```typescript
   import {
     createRouter as createAirbrakeRouter,
     extractAirbrakeConfig,
   } from '@backstage/plugin-airbrake-backend';

   async function main() {
     //... After const config = await loadBackendConfig({ ...

     const airbrakeRouter = await createAirbrakeRouter({
       logger,
       airbrakeConfig: extractAirbrakeConfig(config),
     });

     const service = createServiceBuilder(module)
       // ...
       .addRouter('/api/airbrake', airbrakeRouter);
   }
   ```

5. Add this config as a top level section in your `app-config.yaml`:

   ```yaml
   airbrake:
     apiKey: ${AIRBRAKE_API_KEY}
   ```

6. Set an environment variable `AIRBRAKE_API_KEY` with your [API Key](https://airbrake.io/docs/api/#authentication) before starting Backstage backend.

## Getting started

You can serve the plugin in isolation by running `yarn start` in the plugin directory. This method of serving the plugin
provides quicker iteration speed and a faster startup and hot reloads. It is only meant for local development, and the
setup for it can be found inside the [/dev](./dev) directory.
