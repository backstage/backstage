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
import { useSignalApi } from '@backstage/plugin-signals-react';

const [message, setMessage] = useState<JsonObject | undefined>(undefined);
useSignalApi('myplugin:topic', message => {
  setMessage(message);
});
```

Whenever backend publishes new message to the topic `myplugin:topic`, the state of this component is changed.

## Using API directly

You can also use the signal API directly. This allows more fine-grained control over the state of the connections and
subscriptions.

```ts
import { signalsApiRef } from '@backstage/plugin-signals-react';

const signals = useApi(signalsApiRef);
signals.subscribe('myplugin:topic', (message: JsonObject) => {
  console.log(message);
});
// Remember to unsubscribe
signals.unsubscribe('myplugin:topic');
```
