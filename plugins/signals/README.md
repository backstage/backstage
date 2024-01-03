# signals

Welcome to the signals plugin!

Signals plugin allows backend plugins to publish messages to frontend plugins.

## Getting started

This plugin contains client that can receive messages from the backend. To get started,
see installation instructions from `@backstage/plugin-signals-node`, `@backstage/plugin-signals-backend`.

To install the plugin, you have to add the following to your `packages/app/src/plugins.ts`:

```ts
export { signalsPlugin } from '@backstage/plugin-signals';
```

And make sure that your `packages/app/src/App.tsx` contains:

```ts
import * as plugins from './plugins';

const app = createApp({
  // ...
  plugins: Object.values(plugins),
  // ...
});
```

Now you can utilize the API from other plugins using the `@backstage/plugin-signals-react` package or simply by:

```ts
import { signalsApiRef } from '@backstage/plugin-signals-react';

const signals = useApi(signalsApiRef);
const { unsubscribe } = signals.subscribe(
  'myplugin:topic',
  (message: JsonObject) => {
    console.log(message);
  },
);
// Remember to unsubscribe
unsubscribe();
```
