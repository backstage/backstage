---
'@backstage/plugin-scaffolder-backend': minor
---

Migrate the plugin to use the `ContainerRunner` interface instead of `runDockerContainer(…)`.
It also provides the `ContainerRunner` to the individual templaters instead of to the `createRouter` function.

To apply this change to an existing backend application, add the following to `src/plugins/scaffolder.ts`:

```diff
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
