# @backstage/plugin-signals-react

Welcome to the web library package for the signals plugin!

Signals plugin allows backend plugins to publish messages to frontend plugins.

## Getting started

This plugin contains functionalities that help utilize the signals plugin. To get started,
see installation instructions from `@backstage/plugin-signals-node`, `@backstage/plugin-signals-backend`, and
`@backstage/plugin-signals`.

There are two ways to utilize the signals plugin; either by using the hook or by directly using the API.

## Using the hook

By using the hook, unsubscribe is automatically taken care of. This helps to maintain only necessary amount
of connections to the backend and also to allow multiple subscriptions using the same connection.

Example of using the hook:

```ts
import { useSignal } from '@backstage/plugin-signals-react';

const { lastSignal } = useSignal('myplugin:channel');

useEffect(() => {
  console.log(lastSignal);
}, [lastSignal]);
```

Whenever backend publishes new message to the channel `myplugin:channel`, the `lastSignal` is changed. The `lastSignal`
is always initiated with null value before any messages are received from the backend.

## Using API directly

You can also use the signal API directly. This allows more fine-grained control over the state of the connections and
subscriptions.

```ts
import { signalApiRef } from '@backstage/plugin-signals-react';

const signals = useApi(signalApiRef);
const { unsubscribe } = signals.subscribe(
  'myplugin:channel',
  (message: JsonObject) => {
    console.log(message);
  },
);
// Remember to unsubscribe
unsubscribe();
```
