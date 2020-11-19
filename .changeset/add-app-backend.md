---
'@backstage/create-app': patch
---

Add `app-backend` as a backend plugin, and make a single docker build of the backend the default way to deploy backstage.

Note that the `app-backend` currently only is a solution for deployments of the app, it's not a dev server and is not intended for local development.

## Template changes

As a part of installing the `app-backend` plugin, the below changes where made. The changes are grouped into two steps, installing the plugin, and updating the Docker build and configuration.

### Installing the `app-backend` plugin in the backend

First, install the `@backstage/plugin-app-backend` plugin package in your backend. These changes where made for `v0.3.0` of the plugin, and the installation process might change in the future. Run the following from the root of the repo:

```bash
cd packages/backend
yarn add @backstage/plugin-app-backend
```

For the `app-backend` to get access to the static content in the frontend we also need to add the local `app` package as a dependency. Add the following to your `"dependencies"` in `packages/backend/package.json`, assuming your app package is still named `app` and on version `0.0.0`:

```json
"app": "0.0.0",
```

Don't worry, this will not cause your entire frontend dependency tree to be added to the app, just double check that `packages/app/package.json` has a `"bundled": true` field at top-level. This signals to the backend build process that the package is bundled and that no transitive dependencies should be included.

Next, create `packages/backend/src/plugins/app.ts` with the following:

```ts
import { createRouter } from '@backstage/plugin-app-backend';
import { PluginEnvironment } from '../types';

export default async function createPlugin({
  logger,
  config,
}: PluginEnvironment) {
  return await createRouter({
    logger,
    config,
    appPackageName: 'app',
  });
}
```

In `packages/backend/src/index.ts`, make the following changes:

Add an import for the newly created plugin setup file:

```ts
import app from './plugins/app';
```

Setup the following plugin env.

```ts
const appEnv = useHotMemoize(module, () => createEnv('app'));
```

Change service builder setup to include the `app` plugin as follows. Note that the `app` plugin is not installed on the `/api` route with most other plugins.

```ts
const service = createServiceBuilder(module)
  .loadConfig(config)
  .addRouter('/api', apiRouter)
  .addRouter('', await app(appEnv));
```

You should now have the `app-backend` plugin installed in your backend, ready to serve the frontend bundle!

### Docker build setup

Since the backend image is now the only one needed for a simple Backstage deployment, the image tag name in the `build-image` script inside `packages/backend/package.json` was changed to the following:

```json
"build-image": "backstage-cli backend:build-image --build --tag backstage",
```

For convenience, a `build-image` script was also added to the root `package.json` with the following:

```json
"build-image": "yarn workspace backend build-image",
```

In the root of the repo, a new `app-config.production.yaml` file was added. This is used to set the appropriate `app.baseUrl` now that the frontend is served directly by the backend in the production deployment. It has the following contents:

```yaml
app:
  # Should be the same as backend.baseUrl when using the `app-backend` plugin
  baseUrl: http://localhost:7000

backend:
  baseUrl: http://localhost:7000
  listen:
    port: 7000
```

In order to load in the new configuration at runtime, the command in the `Dockerfile` at the repo root was changed to the following:

```dockerfile
CMD ["node", "packages/backend", "--config", "app-config.yaml", "--config", "app-config.production.yaml"]
```
