---
'@backstage/catalog-model': minor
'@backstage/plugin-catalog-backend': minor
'@backstage/plugin-scaffolder': minor
'@backstage/plugin-scaffolder-backend': minor
'@backstage/create-app': patch
---

Support for `Template` kinds with version `backstage.io/v1alpha1` has now been removed. This means that the old method of running templates with `Preparers`, `Templaters` and `Publishers` has also been removed. If you had any logic in these abstractions, they should now be moved to `actions` instead, and you can find out more about those in the [documentation](https://backstage.io/docs/features/software-templates/writing-custom-actions)

If you need any help migrating existing templates, there's a [migration guide](https://backstage.io/docs/features/software-templates/migrating-from-v1alpha1-to-v1beta2). Reach out to us on Discord in the #support channel if you're having problems.

The `scaffolder-backend` now no longer requires these `Preparers`, `Templaters`, and `Publishers` to be passed in, now all it needs is the `containerRunner`.

Please update your `packages/backend/src/plugins/scaffolder.ts` like the following

```diff
- import {
-  DockerContainerRunner,
-  SingleHostDiscovery,
- } from '@backstage/backend-common';
+ import { DockerContainerRunner } from '@backstage/backend-common';
  import { CatalogClient } from '@backstage/catalog-client';
- import {
-   CookieCutter,
-   CreateReactAppTemplater,
-   createRouter,
-   Preparers,
-   Publishers,
-   Templaters,
- } from '@backstage/plugin-scaffolder-backend';
+ import { createRouter } from '@backstage/plugin-scaffolder-backend';
  import Docker from 'dockerode';
  import { Router } from 'express';
  import type { PluginEnvironment } from '../types';

  export default async function createPlugin({
    config,
    database,
    reader,
+   discovery,
  }: PluginEnvironment): Promise<Router> {
    const dockerClient = new Docker();
    const containerRunner = new DockerContainerRunner({ dockerClient });

-   const cookiecutterTemplater = new CookieCutter({ containerRunner });
-   const craTemplater = new CreateReactAppTemplater({ containerRunner });
-   const templaters = new Templaters();

-   templaters.register('cookiecutter', cookiecutterTemplater);
-   templaters.register('cra', craTemplater);
-
-   const preparers = await Preparers.fromConfig(config, { logger });
-   const publishers = await Publishers.fromConfig(config, { logger });

-   const discovery = SingleHostDiscovery.fromConfig(config);
    const catalogClient = new CatalogClient({ discoveryApi: discovery });

    return await createRouter({
-     preparers,
-     templaters,
-     publishers,
+     containerRunner,
      logger,
      config,
      database,

```
