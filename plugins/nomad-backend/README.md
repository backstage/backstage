# @backstage/plugin-nomad-backend

A backend for [Nomad](https://www.nomadproject.io/), this plugin exposes a service with routes that are used by the `@backstage/plugin-nomad-backend` plugin to query Job and Group information from a Nomad API.

## New Backend System

The Nomad backend plugin has support for the [new backend system](https://backstage.io/docs/backend-system/), here's how you can set that up:

In your `packages/backend/src/index.ts` make the following changes:

```diff
  import { createBackend } from '@backstage/backend-defaults';
  const backend = createBackend();
  // ... other feature additions
  backend.add(import('@backstage/plugin-nomad-backend'));
  backend.start();
```

## Set Up

1. Install the plugin using:

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-nomad-backend
```

2. Create a `nomad.ts` file inside `packages/backend/src/plugins/`:

```typescript
import { createRouter } from '@backstage/plugin-nomad-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  props: PluginEnvironment,
): Promise<Router> {
  return await createRouter(props);
}
```

3. Modify your `packages/backend/src/index.ts` to include:

```diff
 ...

 import { Config } from '@backstage/config';
 import app from './plugins/app';
+import nomad from './plugins/nomad';
 ...

 async function main() {
   ...

   const authEnv = useHotMemoize(module, () => createEnv('auth'));
+  const nomadEnv = useHotMemoize(module, () => createEnv('nomad'));
   ...

   const apiRouter = Router();
   apiRouter.use('/catalog', await catalog(catalogEnv));
+  apiRouter.use('/nomad', await nomad(nomadEnv));
```

Note: for this backend to work, the `nomad` configuration described in the README of `@backstage/plugin-nomad` must be implemented.
