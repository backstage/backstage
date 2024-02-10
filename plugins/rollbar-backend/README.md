# Rollbar Backend

Simple plugin that proxies requests to the [Rollbar](https://rollbar.com) API.

## Setup

1. Install the plugin using:

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-rollbar-backend
```

2. Create a `rollbar.ts` file inside `packages/backend/src/plugins/`:

```typescript
import { createRouter } from '@backstage/plugin-rollbar-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    config: env.config,
  });
}
```

3. Modify your `packages/backend/src/index.ts` to include:

```diff
 ...

 import { Config } from '@backstage/config';
 import app from './plugins/app';
+import rollbar from './plugins/rollbar';
 import scaffolder from './plugins/scaffolder';

 ...

 async function main() {

   ...

   const authEnv = useHotMemoize(module, () => createEnv('auth'));
+  const rollbarEnv = useHotMemoize(module, () => createEnv('rollbar'));
   const proxyEnv = useHotMemoize(module, () => createEnv('proxy'));

   ...

   const apiRouter = Router();
   apiRouter.use('/catalog', await catalog(catalogEnv));
+  apiRouter.use('/rollbar', await rollbar(rollbarEnv));
   apiRouter.use('/scaffolder', await scaffolder(scaffolderEnv));
```

The following values are read from the configuration file.

```yaml
rollbar:
  accountToken: ${ROLLBAR_ACCOUNT_TOKEN}
```

_NOTE: The `ROLLBAR_ACCOUNT_TOKEN` environment variable must be set to a read
access account token._

## Links

- [Frontend part of the plugin](https://github.com/backstage/backstage/tree/master/plugins/rollbar)
- [The Backstage homepage](https://backstage.io)
