---
'@backstage/plugin-sentry': minor
'@backstage/plugin-sentry-backend': minor
---

The plugin uses the `proxy-backend` instead of a custom `sentry-backend`.
It requires a proxy configuration:

`app-config.yaml`:

```yaml
proxy:
  '/sentry/api':
    target: https://sentry.io/api/
    allowedMethods: ['GET']
    headers:
      Authorization:
        $env: SENTRY_TOKEN # export SENTRY_TOKEN="Bearer <your-sentry-token>"
```

The `MockApiBackend` is no longer configured by the `NODE_ENV` variable.
Instead, the mock backend can be used with an api-override:

`packages/app/src/apis.ts`:

```ts
import { createApiFactory } from '@backstage/core';
import { MockSentryApi, sentryApiRef } from '@backstage/plugin-sentry';

export const apis = [
  // ...

  createApiFactory(sentryApiRef, new MockSentryApi()),
];
```

If you already use the Sentry backend, you must remove it from the backend:

Delete `packages/backend/src/plugins/sentry.ts`.

```diff
# packages/backend/package.json

...
    "@backstage/plugin-scaffolder-backend": "^0.3.2",
-   "@backstage/plugin-sentry-backend": "^0.1.3",
    "@backstage/plugin-techdocs-backend": "^0.3.0",
...
```

```diff
// packages/backend/src/index.html

  const apiRouter = Router();
  apiRouter.use('/catalog', await catalog(catalogEnv));
  apiRouter.use('/rollbar', await rollbar(rollbarEnv));
  apiRouter.use('/scaffolder', await scaffolder(scaffolderEnv));
- apiRouter.use('/sentry', await sentry(sentryEnv));
  apiRouter.use('/auth', await auth(authEnv));
  apiRouter.use('/techdocs', await techdocs(techdocsEnv));
  apiRouter.use('/kubernetes', await kubernetes(kubernetesEnv));
  apiRouter.use('/proxy', await proxy(proxyEnv));
  apiRouter.use('/graphql', await graphql(graphqlEnv));
  apiRouter.use(notFoundHandler());
```
