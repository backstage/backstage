---
'@backstage/plugin-techdocs-backend': minor
---

Migrate the plugin to use the `ContainerRunner` interface instead of `runDockerContainer(…)`.
It also provides the `ContainerRunner` to the generators instead of to the `createRouter` function.

To apply this change to an existing backend application, add the following to `src/plugins/techdocs.ts`:

```diff
+ import { DockerContainerRunner } from '@backstage/backend-common';

  // ...

  export default async function createPlugin({
    logger,
    config,
    discovery,
    reader,
  }: PluginEnvironment): Promise<Router> {
    // Preparers are responsible for fetching source files for documentation.
    const preparers = await Preparers.fromConfig(config, {
      logger,
      reader,
    });

+   // Docker client (conditionally) used by the generators, based on techdocs.generators config.
+   const dockerClient = new Docker();
+   const containerRunner = new DockerContainerRunner({ dockerClient });

    // Generators are used for generating documentation sites.
    const generators = await Generators.fromConfig(config, {
      logger,
+     containerRunner,
    });

    // Publisher is used for
    // 1. Publishing generated files to storage
    // 2. Fetching files from storage and passing them to TechDocs frontend.
    const publisher = await Publisher.fromConfig(config, {
      logger,
      discovery,
    });

    // checks if the publisher is working and logs the result
    await publisher.getReadiness();

-   // Docker client (conditionally) used by the generators, based on techdocs.generators config.
-   const dockerClient = new Docker();

    return await createRouter({
      preparers,
      generators,
      publisher,
-     dockerClient,
      logger,
      config,
      discovery,
    });
  }
```
