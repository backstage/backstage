# @backstage/plugin-hcp-consul-backend

A backend for HCP Consul, this plugin exposes a services with routes that are used by the `@backstage/plugin-hcp-consul` plugin to query HCP Consul overview and service instances using using HCP Consul Central public APIs.

## Set Up

1. Install the plugin using:

```bash
# From your Backstage root directory
yarn add --cwd packages/backend @backstage/plugin-hcp-consul-backend
```

2. Create a `hcp-consul-backend.ts` file inside `packages/backend/src/plugins/`:

```typescript
import { createRouter } from '@backstage/plugin-hcp-consul-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter(env);
}
```

3. Modify your `packages/backend/src/index.ts` to include:

```diff
 ...

 import { Config } from '@backstage/config';
 import app from './plugins/app';
+import consul from './plugins/hcp-consul-backend';
 ...

 async function main() {
   ...

   const authEnv = useHotMemoize(module, () => createEnv('auth'));
+  const consulBackendEnv = useHotMemoize(module, () => createEnv('consul'));
   ...

   const apiRouter = Router();
   apiRouter.use('/catalog', await catalog(catalogEnv));
+  apiRouter.use('/hcp-consul-backend', await consul(consulBackendEnv));
```

Note: for this backend to work, the `consul` configuration described in the README of `@backstage/plugin-hcp-consul` must be implemented.
