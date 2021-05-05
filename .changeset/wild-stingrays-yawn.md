---
'@backstage/create-app': patch
---

The `scaffolder-backend` and `techdocs-backend` plugins have been updated.
In order to update, you need to apply the following changes to your existing backend application:

`@backstage/plugin-techdocs-backend`:

```diff
// packages/backend/src/plugin/techdocs.ts

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

`@backstage/plugin-scaffolder-backend`:

```diff
// packages/backend/src/plugin/scaffolder.ts

- import { SingleHostDiscovery } from '@backstage/backend-common';
+ import {
+   DockerContainerRunner,
+   SingleHostDiscovery,
+ } from '@backstage/backend-common';


  export default async function createPlugin({
    logger,
    config,
    database,
    reader,
  }: PluginEnvironment): Promise<Router> {
+   const dockerClient = new Docker();
+   const containerRunner = new DockerContainerRunner({ dockerClient });

+   const cookiecutterTemplater = new CookieCutter({ containerRunner });
-   const cookiecutterTemplater = new CookieCutter();
+   const craTemplater = new CreateReactAppTemplater({ containerRunner });
-   const craTemplater = new CreateReactAppTemplater();
    const templaters = new Templaters();

    templaters.register('cookiecutter', cookiecutterTemplater);
    templaters.register('cra', craTemplater);

    const preparers = await Preparers.fromConfig(config, { logger });
    const publishers = await Publishers.fromConfig(config, { logger });

-   const dockerClient = new Docker();

    const discovery = SingleHostDiscovery.fromConfig(config);
    const catalogClient = new CatalogClient({ discoveryApi: discovery });

    return await createRouter({
      preparers,
      templaters,
      publishers,
      logger,
      config,
-     dockerClient,
      database,
      catalogClient,
      reader,
    });
  }
```
