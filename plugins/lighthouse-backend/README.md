# Lighthouse Backend

Lighthouse Backend allows you to run scheduled lighthouse Tests for each Website with the annotation `lighthouse.com/website-url`.

## Setup

1. Install the plugin using:

```bash
# From your Backstage root directory
yarn add --cwd packages/backend @backstage/plugin-lighthouse-backend
```

2. Create a `lighthouse.ts` file inside `packages/backend/src/plugins/`:

```typescript
import { createScheduler } from '@backstage/plugin-lighthouse-backend';
import { PluginEnvironment } from '../types';
import { CatalogClient } from '@backstage/catalog-client';

export default async function createPlugin(env: PluginEnvironment) {
  const { logger, scheduler, config } = env;

  const catalogClient = new CatalogClient({
    discoveryApi: env.discovery,
  });

  await createScheduler({ logger, scheduler, config, catalogClient });
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

## Configuration

You can define how often and when the scheduler should run the audits:

```yaml
lighthouse:
  schedule:
    days: 1
```
