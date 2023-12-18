# notifications

Welcome to the notifications backend plugin!

## Getting started

First you have to install the `@backstage/plugin-notifications-node` package.

Then create a new file to `packages/backend/src/plugins/notifications.ts`:

```ts
import { createRouter } from '@backstage/plugin-notifications-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    identity: env.identity,
    notificationService: env.notificationService,
  });
}
```

and add it to `packages/backend/src/index.ts`:

```ts
async function main() {
  //...
  const notificationsEnv = useHotMemoize(module, () =>
    createEnv('notifications'),
  );

  // ...
  apiRouter.use('/notifications', await notifications(notificationsEnv));
}
```
