# signals

Welcome to the signals backend plugin!

Signals plugin allows backend plugins to publish messages to frontend plugins.

## Getting started

Signals service requires that you have also `events-backend` plugin installed.

Add SignalsApi to your plugin environment in `packages/backend/src/index.ts`:

```ts
import { DefaultSignalsClient } from '@backstage/plugin-signals-backend';
import { DefaultEventBroker } from '@backstage/plugin-events-backend';

function makeCreateEnv(config: Config) {
  // ...

  const eventBroker = new DefaultEventBroker(root.child({ type: 'plugin' }));

  return (plugin: string): PluginEnvironment => {
    const logger = root.child({ type: 'plugin', plugin });
    const signals = DefaultSignalsClient.forPlugin(plugin, {
      logger,
      eventBroker,
    });
    return {
      logger,
      eventBroker,
      // ...
      signals,
    };
  };
}
```

Additionally, you need to pass the HTTP server instance to the plugin to start the service:

Add new file to `packages/backend/src/plugins/signals.ts`:

```ts
import {
  ServiceOptions,
  SignalsService,
} from '@backstage/plugin-signals-backend';

export default async function createSignalsService(options: ServiceOptions) {
  return SignalsService.create(options);
}
```

And call the service creation in `packages/backend/src/index.ts` after creating the service
builder:

```ts
import signalsService from './plugins/signals';

const signalsEnv = useHotMemoize(module, () => createEnv('signals'));

const service = createServiceBuilder(module)
  .loadConfig(config)
  .addRouter('', await healthcheck(healthcheckEnv))
  .addRouter('', metricsHandler())
  .addRouter('/api', apiRouter)
  .addRouter('', await app(appEnv));

await service
  .start()
  .then(async server => {
    await signalsService({ httpServer: server, ...signalsEnv });
  })
  .catch(err => {
    logger.error(err);
    process.exit(1);
  });
```

## Publishing events from plugins

To publish events to frontend from your backend plugins, you can use the publish command
from `SignalsApi`:

```ts
await pluginEnv.signals.publish({ test: 'test' });
```

You can also target the events to specific topic or owner entity references:

```ts
await pluginEnv.signals.publish(
  { test: 'test' },
  { targetOwnershipEntityRefs: ['group:default/group'], topic: 'my-topic' },
);
```
