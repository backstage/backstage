# signals

Welcome to the signals plugin!

Signals plugin allows backend plugins to publish messages to frontend plugins.

## Getting started

This plugin contains client that can receive messages from the backend. To get started,
see installation instructions from `@backstage/plugin-signals-node`, `@backstage/plugin-signals-backend`.

To install this signals frontend plugin, please refer the [Getting Started](https://backstage.io/docs/notifications) Backstage Notifications and Signals documentation section.

Now you can utilize the API from other plugins using the `@backstage/plugin-signals-react` package or simply by:

```ts
import { signalApiRef } from '@backstage/plugin-signals-react';

const signals = useApi(signalApiRef);
const { unsubscribe } = signals.subscribe(
  'myplugin:topic',
  (message: JsonObject) => {
    console.log(message);
  },
);
// Remember to unsubscribe
unsubscribe();
```
