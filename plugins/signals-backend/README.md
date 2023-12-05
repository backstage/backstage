# signals

Welcome to the signals backend plugin!

Signals plugin allows backend plugins to publish messages to frontend plugins.

## Getting started

First install the `@backstage/plugin-signals-node` plugin to get the `SignalService` set up.

Next, add Signals router to your backend in `packages/backend/src/plugins/signals.ts`:

```ts
import { Router } from 'express';
import { createRouter } from '@backstage/plugin-signals-backend';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    service: env.signalsService,
  });
}
```
