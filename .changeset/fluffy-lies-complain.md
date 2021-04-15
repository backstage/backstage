---
'@backstage/techdocs-common': minor
---

Move the sanity checks of the publisher configurations to a dedicated `PublisherBase#getReadiness()` method instead of throwing an error when doing `Publisher.fromConfig(...)`.
You should include the check when your backend to get early feedback about a potential misconfiguration:

```diff
  // packages/backend/src/plugins/techdocs.ts

  export default async function createPlugin({
    logger,
    config,
    discovery,
    reader,
  }: PluginEnvironment): Promise<Router> {
    // ...

    const publisher = await Publisher.fromConfig(config, {
      logger,
      discovery,
    })

+   // checks if the publisher is working and logs the result
+   await publisher.getReadiness();

    // Docker client (conditionally) used by the generators, based on techdocs.generators config.
    const dockerClient = new Docker();

    // ...
}
```

If you want to crash your application on invalid configurations, you can throw an `Error` to preserve the old behavior.
Please be aware that this is not the recommended for the use in a Backstage backend but might be helpful in CLI tools such as the `techdocs-cli`.

```ts
const publisher = await Publisher.fromConfig(config, {
  logger,
  discovery,
});

const ready = await publisher.getReadiness();
if (!ready.isAvailable) {
  throw new Error('Invalid TechDocs publisher configuration');
}
```
