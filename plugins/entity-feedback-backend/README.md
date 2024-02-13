# Entity Feedback Backend

Welcome to the entity-feedback backend plugin!

## Installation

Note: this plugin requires authentication and identity configured so Backstage can identify
which user has rated the entity. If you are using the guest identity provider which comes
out of the box, this plugin will not work when you test it.

### Install the package

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-entity-feedback-backend
```

### Adding the plugin to your `packages/backend`

You'll need to add the plugin to the router in your `backend` package. You can do this by creating a file called `packages/backend/src/plugins/entityFeedback.ts`

```tsx
import { createRouter } from '@backstage/plugin-entity-feedback-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default function createPlugin(env: PluginEnvironment): Promise<Router> {
  return createRouter({
    database: env.database,
    discovery: env.discovery,
    identity: env.identity,
    logger: env.logger,
  });
}
```

With the `entityFeedback.ts` router setup in place, add the router to `packages/backend/src/index.ts`:

```diff
+import entityFeedback from './plugins/entityFeedback';

async function main() {
  ...
  const createEnv = makeCreateEnv(config);

  const catalogEnv = useHotMemoize(module, () => createEnv('catalog'));
+ const entityFeedbackEnv = useHotMemoize(module, () => createEnv('entityFeedback'));

  const apiRouter = Router();
+ apiRouter.use('/entity-feedback', await entityFeedback(entityFeedbackEnv));
  ...
  apiRouter.use(notFoundHandler());

```

### New Backend System

The Entity Feedback backend plugin has support for the [new backend system](https://backstage.io/docs/backend-system/), here's how you can set that up:
In your `packages/backend/src/index.ts` make the following changes:

```diff
+ import { entityFeedbackPlugin } from '@backstage/plugin-entity-feedback-backend';

const backend = createBackend();
+ backend.add(entityFeedbackPlugin());
// ... other feature additions

backend.start();
```
