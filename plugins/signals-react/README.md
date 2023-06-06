# @backstage/plugin-signals-react

Welcome to the web library package for the signals plugin!

This plugin allows frontend plugins to receive events from the backend plugins. It requires
that the `@backstage/plugin-signals-backend` has been installed and configured correctly.

Receiving messages is done using the `useSignals` hook:

```tsx
import { useSignals } from '@backstage/plugin-signals-react';

useSignals({
  pluginId: 'plugin-id',
  topic: 'my-topic',
  onMessage: (data: any) => console.log(data),
});
```
