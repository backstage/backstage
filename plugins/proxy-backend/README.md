# Proxy backend plugin

This is the backend plugin that enables proxy definitions to be declared in and read from app-config.yaml.

Relies on the `http-proxy-middleware` package.

## Getting Started

This backend plugin can be started in a standalone mode from directly in this package
with `yarn start`. However, it will have limited functionality and that process is
most convenient when developing the plugin itself.

To run it within the backend do:

1. Register the router in `packages/backend/src/index.ts`:

```ts
const proxyEnv = useHotMemoize(module, () => createEnv('proxy'));

const service = createServiceBuilder(module)
  .loadConfig(configReader)
  /** several different routers */
  .addRouter('/', await proxy(proxyEnv));
```

2. Start the backend

```bash
yarn workspace example-backend start
```

This will launch the full example backend.

## Links

- [http-proxy-middleware](https://www.npmjs.com/package/http-proxy-middleware)
