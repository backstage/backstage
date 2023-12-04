# signals

Welcome to the signals backend plugin!

Signals plugin allows backend plugins to publish messages to frontend plugins.

## Getting started

Add Signals router to your backend in `packages/backend/src/plugins/signals.ts`:

```ts
import { Router } from 'express';
import { createRouter } from '@backstage/plugin-signals-backend';
import { SignalsService } from '@backstage/plugin-signals-node';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const service = SignalsService.create({
    logger: env.logger,
    identity: env.identity,
    eventBroker: env.eventBroker,
  });

  return await createRouter({
    logger: env.logger,
    service,
  });
}
```
