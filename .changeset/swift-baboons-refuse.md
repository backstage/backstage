---
'@backstage/create-app': patch
---

use `fromConfig` for all scaffolder helpers, and use the url protocol for app-config location entries.

To apply this change to your local installation, replace the contents of your `packages/backend/src/plugins/scaffolder.ts` with the following contents:

```ts
import {
  CookieCutter,
  createRouter,
  Preparers,
  Publishers,
  CreateReactAppTemplater,
  Templaters,
  CatalogEntityClient,
} from '@backstage/plugin-scaffolder-backend';
import { SingleHostDiscovery } from '@backstage/backend-common';
import type { PluginEnvironment } from '../types';
import Docker from 'dockerode';

export default async function createPlugin({
  logger,
  config,
}: PluginEnvironment) {
  const cookiecutterTemplater = new CookieCutter();
  const craTemplater = new CreateReactAppTemplater();
  const templaters = new Templaters();
  templaters.register('cookiecutter', cookiecutterTemplater);
  templaters.register('cra', craTemplater);

  const preparers = await Preparers.fromConfig(config, { logger });
  const publishers = await Publishers.fromConfig(config, { logger });

  const dockerClient = new Docker();

  const discovery = SingleHostDiscovery.fromConfig(config);
  const entityClient = new CatalogEntityClient({ discovery });

  return await createRouter({
    preparers,
    templaters,
    publishers,
    logger,
    config,
    dockerClient,
    entityClient,
  });
}
```

This will ensure that the `scaffolder-backend` package can add handlers for the `url` protocol which is becoming the standard when registering entities in the `catalog`
