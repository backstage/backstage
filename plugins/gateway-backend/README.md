# gateway

Welcome to the gateway backend plugin!

This plugin is useful for adopters who have [split the backend plugins into multiple different Backstage deployments](https://backstage.io/docs/backend-system/building-backends/index#split-into-multiple-backends) and implemented their own Discovery service to resolve the urls of the backend plugins.

A custom discovery service helps you routing the requests from a backend plugin to another backend plugin, but it doesn't help you routing the requests from the frontend to a backend plugin, unless you hardcode the urls in the frontend or expose the different backend plugins via a custom reverse proxy.

You can deploy this plugin in a "gateway" Backstage deployment to route requests from the frontend to the correct backend plugin. The plugin leverages the Discovery service to resolve the urls of the other backend plugins. If a plugin is already installed in the "gateway" Backstage deployment, the plugin the local plugin will be used.

## Installation

This plugin is installed via the `@backstage/plugin-gateway-backend` package. To install it to your backend package, run the following command:

```bash
# From your root directory
yarn --cwd packages/backend add @backstage/plugin-gateway-backend
```

Then add the plugin to your backend in `packages/backend/src/index.ts`:

```ts
const backend = createBackend();
// ...
backend.add(import('@backstage/plugin-gateway-backend'));
```

Make sure to configure the `baseUrl` in the `app-config.yaml` file to point to the "gateway" Backstage deployment.

```yaml
backend:
  # the baseUrl of the "gateway" Backstage deployment
  baseUrl: http://gateway-backstage-backend.example.com
```
