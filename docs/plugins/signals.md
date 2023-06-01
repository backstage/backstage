---
id: signals
title: Signals
sidebar_label: Signals
description: Signanls allows plugins to communicate asynchronously with each other
---

# Concept

Signals in Backstage plugins work with subscribe-publish model. Each plugin can subscribe
to other plugins messages and subscribe works for both frontend and backend plugins.
Additionally, plugins can subscribe only to a specific topic of the messages which allows
plugins to only listen to messages they are interested in.

Publishing messages to signal channel can only be done from the backend plugins.

## Configuration

To enable signals support, configuration value `backend.signals` must be set to `true`:

```yaml
backend:
  baseUrl: http://localhost:7007
  signals: true
```

In this case, signal clients will use the `backend.baseUrl` as the connection address so it must be
defined as well. If the configuration value is `false` or not defined, the signal server will
not be started and the clients will default to no operation and do nothing.

If you need to connect the service from outside, the signal endpoint must be specified in the configuration
as follows:

```yaml
backend:
  baseUrl: http://localhost:7007
  signals:
    enabled: true
    endpoint: ws://localhost:7007
```

### Handling multiple backend instances

To be able to deliver signals to multiple backend instances, an adapter configuration has to be specified.
Currently only `pg` is supported as an adapter to share signals between the instances. The configuration
uses same database configuration as you have defined for the backend.

```yaml
backend:
  baseUrl: http://localhost:7007
  signals:
    enabled: true
    endpoint: ws://localhost:7007
    adapter: 'pg'
  database:
    client: 'pg'
    connection:
      host: localhost
      port: 5432
      user: postgres
      password: postgres
```

## Backend plugins

To use the signals in backend plugins, you can pass the `SignalsClientManager` in plugin
environment to the plugin. In your `packages/backend/src/index.ts` add the client manager
to the environment as follows:

```ts
import { SignalsClientManager } from '@backstage/backend-common';

function makeCreateEnv(config: Config) {
  const signalsClientManager = SignalsClientManager.fromConfig(config, {
    logger: root,
    tokenManager,
  });

  return (plugin: string): PluginEnvironment => {
    // ...
    const signalsManager = signalsClientManager.forPlugin(plugin);

    return {
      // ...
      signalsManager,
    };
  };
}
```

Also, add the manager to your `PluginEnvironment` in `packages/backend/src/types.ts`:

```ts
import { PluginSignalsManager } from '@backstage/backend-common';

export type PluginEnvironment = {
  // ...
  signalsManager: PluginSignalsManager;
};
```

Pass the manager to your plugin for example in `packages/backend/src/plugins/myplugin.ts`:

```ts
export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    singnals: env.signalsManager.getClient(),
  });
}
```

To subscribe and publish messages to the signals channel, the connection must be first established:

```ts
import { SignalsService } from '@backstage/backend-plugin-api';

export interface RouterOptions {
  signals: SignalsService;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { signals } = options;
  await signals.connect();

  // ...
  await signals.publish(
    { data: 'data' }, // Data to be sent
    {
      topic: 'topic', // Target topic
      entityRefs: ['user:default/john.doe', 'group:default/admins'], // Target entity references
    },
  );
  // ...
  await signals.subscribe(
    'catalog', // Plugin to subscribe
    (data: any) => {
      // Callback for data from the plugin publish
      console.log(data);
    },
    'topic', // Topic to subscribe
  );
}
```

> **Note: It is recommended not to send messages containing information that requires authentication or authorization through the signals channel for the time being**

## Frontend plugins

Frontend plugins can subscribe to messages from the backend plugins using the `signalsApiRef`:

```ts
import { useApi, signalsApiRef } from '@backstage/core-plugin-api';

const signals = useApi(signalsApiRef);
await signals.subscribe('myplugin', data => {
  console.log(data);
});
```

In React components, the handling of subscriptions should be placed inside `useEffect` hook so that
the subscription is removed once the component does not need the signals data anymore:

```ts
import { useApi, signalsApiRef } from '@backstage/core-plugin-api';

const signals = useApi(signalsApiRef);
useEffect(() => {
  signals.subscribe('catalog', (data: any) => {
    console.log(data);
  });
  return () => {
    signals.unsubscribe('catalog');
  };
}, [signals]);
```
