# Lighthouse Backend

Lighthouse Backend allows you to run scheduled lighthouse Tests for each Website with the annotation `lighthouse.com/website-url`.

## Setup

1. Install the plugin using:

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-lighthouse-backend
```

2. Create a `lighthouse.ts` file inside `packages/backend/src/plugins/`:

```typescript
import { createScheduler } from '@backstage/plugin-lighthouse-backend';
import { PluginEnvironment } from '../types';
import { CatalogClient } from '@backstage/catalog-client';

export default async function createPlugin(env: PluginEnvironment) {
  const { logger, scheduler, config, tokenManager } = env;

  const catalogClient = new CatalogClient({
    discoveryApi: env.discovery,
  });

  await createScheduler({
    logger,
    scheduler,
    config,
    catalogClient,
    tokenManager,
  });
}
```

3. Modify your `packages/backend/src/index.ts` to include:

```diff
 ...

 import { Config } from '@backstage/config';
 import app from './plugins/app';
+import lighthouse from './plugins/lighthouse';
 import scaffolder from './plugins/scaffolder';

 ...

 async function main() {

   ...

   const authEnv = useHotMemoize(module, () => createEnv('auth'));
+  const lighthouseEnv = useHotMemoize(module, () => createEnv('lighthouse'));
   const proxyEnv = useHotMemoize(module, () => createEnv('proxy'));

   ...

   const apiRouter = Router();
   apiRouter.use('/catalog', await catalog(catalogEnv));
   apiRouter.use('/scaffolder', await scaffolder(scaffolderEnv));

+  await lighthouse(lighthouseEnv)
```

#### New Backend System

The Lighthouse backend plugin has support for the [new backend system](https://backstage.io/docs/backend-system/), here's how you can set that up:

In your `packages/backend/src/index.ts` make the following changes:

```diff
  import { createBackend } from '@backstage/backend-defaults';
+ import { lighthousePlugin } from '@backstage/plugin-lighthouse-backend';
  const backend = createBackend();
  // ... other feature additions
+ backend.add(lighthousePlugin());
  backend.start();
```

## Configuration

You can define how often and when the scheduler should run the audits:

```yaml
lighthouse:
  schedule:
    frequency:
      hours: 12 # Default: 1 day
    timeout:
      minutes: 30 # Default: 10 minutes
```
