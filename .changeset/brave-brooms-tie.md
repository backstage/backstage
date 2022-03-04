---
'@backstage/create-app': patch
---

Builtin support for cookiecutter based templates has been removed from `@backstage/plugin-scaffolder-backend`. Due to this, the `containerRunner` argument to its `createRouter` has also been removed.

If you do not use cookiecutter templates and are fine with removing support from it in your own installation, update your `packages/backend/src/plugins/scaffolder.ts` file as follows:

```diff
-import { DockerContainerRunner } from '@backstage/backend-common';
 import { CatalogClient } from '@backstage/catalog-client';
 import { createRouter } from '@backstage/plugin-scaffolder-backend';
-import Docker from 'dockerode';
 import { Router } from 'express';
 import type { PluginEnvironment } from '../types';

 export default async function createPlugin({
   reader,
   discovery,
 }: PluginEnvironment): Promise<Router> {
-  const dockerClient = new Docker();
-  const containerRunner = new DockerContainerRunner({ dockerClient });
-
   const catalogClient = new CatalogClient({ discoveryApi: discovery });
-
   return await createRouter({
-    containerRunner,
     logger,
     config,
  // ...
```

If you want to retain cookiecutter support, please use the `@backstage/plugin-scaffolder-backend-module-cookiecutter` package explicitly (see [its README](https://github.com/backstage/backstage/tree/master/plugins/scaffolder-backend-module-cookiecutter) for installation instructions).
