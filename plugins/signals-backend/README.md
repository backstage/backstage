# signals

Welcome to the signals backend plugin!

Signals plugin allows backend plugins to publish messages to frontend plugins.

## Getting started

First install the `@backstage/plugin-signals-node` plugin to get the `SignalsService` set up.

### New backend

Install `@backstage/plugin-signals-backend`. Then add the import to your `packages/backend/src/index.ts`:

```ts
const backend = createBackend();
// ...
backend.add(import('@backstage/plugin-signals-backend'));
// ...
backend.start();
```

### Old backend

Add Signals router to your backend in `packages/backend/src/plugins/signals.ts`:

```ts
import { Router } from 'express';
import { createRouter } from '@backstage/plugin-signals-backend';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    eventBroker: env.eventBroker,
    identity: env.identity,
    discovery: env.discovery,
    permissions: env.permissions,
  });
}
```

Now add the signals to `packages/backend/src/index.ts`:

```ts
// ...
import signals from './plugins/signals';

async function main() {
  // ...
  const signalsEnv = useHotMemoize(module, () => createEnv('signals'));

  const apiRouter = Router();
  // ...
  apiRouter.use('/signals', await signals(signalsEnv));
  apiRouter.use(notFoundHandler());
  // ...
}
```
