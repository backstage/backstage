---
'@backstage/cli': patch
---

Make `yarn dev` in newly created backend plugins respect the `PLUGIN_PORT` environment variable.

You can achieve the same in your created backend plugins by making sure to properly call the port and CORS methods on your service builder. Typically in a file named `src/service/standaloneServer.ts` inside your backend plugin package, replace the following:

```ts
const service = createServiceBuilder(module)
  .enableCors({ origin: 'http://localhost:3000' })
  .addRouter('/my-plugin', router);
```

With something like the following:

```ts
let service = createServiceBuilder(module)
  .setPort(options.port)
  .addRouter('/my-plugin', router);
if (options.enableCors) {
  service = service.enableCors({ origin: 'http://localhost:3000' });
}
```
