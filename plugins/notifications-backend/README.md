# notifications

Welcome to the notifications backend plugin!

## Getting started

First you have to install `@backstage/plugin-notifications-node` and `@backstage/plugin-signals-node` 
packages.

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
    tokenManager: env.tokenManager,
    database: env.database,
    discovery: env.discovery,
    signalService: env.signalService
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

## Extending Notifications

The notifications can be extended with `NotificationProcessor`. These processors allow to decorate notifications
before they are sent or/and send the notifications to external services.
