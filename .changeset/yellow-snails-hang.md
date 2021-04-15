---
'@backstage/create-app': patch
---

Due to a change in the techdocs publishers, they don't check if they are able to reach e.g. the configured S3 bucket anymore.
This can be added again by the following change. Note that the backend process will no longer exit when it is not reachable but will only emit an error log message.
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
