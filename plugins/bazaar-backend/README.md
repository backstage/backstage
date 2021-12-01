# Bazaar Backend

Welcome to the Bazaar backend plugin!

# Installation

## Install the package

```bash
# From your Backstage root directory
cd packages/backend
yarn add @backstage/plugin-bazaar-backend
```

## Adding the plugin to your `packages/backend`

You'll need to add the plugin to the router in your `backend` package. You can do this by creating a file called `packages/backend/src/plugins/bazaar.ts`

```tsx
import { PluginEnvironment } from '../types';
import { createRouter } from '@backstage/plugin-bazaar-backend';

export default async function createPlugin({
  logger,
  database,
  config,
}: PluginEnvironment) {
  return await createRouter({ logger, config, database });
}
```

With the `bazaar.ts` router setup in place, add the router to `packages/backend/src/index.ts`:

```diff
+ import bazaar from './plugins/bazaar';

async function main() {
  ...
  const createEnv = makeCreateEnv(config);

  const catalogEnv = useHotMemoize(module, () => createEnv('catalog'));
+    const bazaarEnv = useHotMemoize(module, () => createEnv('bazaar'));

  const apiRouter = Router();
+  apiRouter.use('/bazaar', await bazaar(bazaarEnv));
  ...
  apiRouter.use(notFoundHandler());

```
