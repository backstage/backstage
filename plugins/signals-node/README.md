# @backstage/plugin-signals-node

Welcome to the Node.js library package for the signals plugin!

Signals plugin allows backend plugins to publish messages to frontend plugins.

## Getting started

### New backend system

In `packages/backend/index.ts`, add the signals backend:

```ts
backend.add(import('@backstage/plugin-signals-backend'));
```

To use signals in your plugin, add it as a dependency to `my-plugin/plugin.ts`:

```ts
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { signalsServiceRef } from '@backstage/plugin-signals-node';

export const myPlugin = createBackendPlugin({
  pluginId: 'my-plugin',
  register(env) {
    env.registerInit({
      deps: {
        httpRouter: coreServices.httpRouter,
        signals: signalsServiceRef,
      },
      async init({ httpRouter, signals }) {
        httpRouter.use(
          await createRouter({
            signals,
          }),
        );
      },
    });
  },
});
```

### Old backend system

Add SignalService to your plugin environment in `packages/backend/src/types.ts`:

```ts
import { SignalsService } from '@backstage/plugin-signals-node';

export type PluginEnvironment = {
  // ...
  signals: SignalsService;
};
```

Add it also to your `makeCreateEnv` to allow access from the other plugins:

```ts
import {
  SignalsService,
  DefaultSignalsService,
} from '@backstage/plugin-signals-node';
import { DefaultEventBroker } from '@backstage/plugin-events-backend';

function makeCreateEnv(config: Config) {
  // ...

  const eventBroker = new DefaultEventBroker(root.child({ type: 'plugin' }));
  const signalsService = DefaultSignalsService.create({
    eventBroker,
  });

  return (plugin: string): PluginEnvironment => {
    const logger = root.child({ type: 'plugin', plugin });
    return {
      logger,
      eventBroker,
      signals: signalsService,
      // ...
    };
  };
}
```

To allow connections from the frontend, you should also install the `@backstage/plugin-signals-backend`.

## Using the service

Once you have both of the backend plugins installed, you can utilize the signal service by calling the
`publish` method. This will publish the message to all subscribers in the frontend. To send message to
all subscribers, you can use `broadcast` type:

```ts
// Periodic sending example
setInterval(async () => {
  await signals.publish({
    recipients: { type: 'broadcast' },
    channel: 'my_plugin',
    message: {
      message: 'hello world',
    },
  });
}, 5000);
```

To receive this message in the frontend, check the documentation of `@backstage/plugin-signals` and
`@backstage/plugin-signals-react`.

## Using event broker directly

Other way to send signals is to utilize the `EventBroker` directly. This requires that the payload is correct for it
to work:

```ts
eventBroker.publish({
  topic: 'signals',
  eventPayload: {
    recipients: { type: 'user', entityRef: 'user:default/user1' },
    message: {
      message: 'hello world',
    },
    channel: 'my_plugin',
  },
});
```
