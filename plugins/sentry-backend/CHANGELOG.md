# @backstage/plugin-sentry-backend

## 0.2.0

### Minor Changes

- 075d3dc5a: The plugin uses the `proxy-backend` instead of a custom `sentry-backend`.
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

### Patch Changes

- Updated dependencies [38e24db00]
- Updated dependencies [12bbd748c]
  - @backstage/backend-common@0.4.0

## 0.1.3

### Patch Changes

- Updated dependencies [1722cb53c]
- Updated dependencies [1722cb53c]
- Updated dependencies [7b37e6834]
- Updated dependencies [8e2effb53]
  - @backstage/backend-common@0.3.0

## 0.1.2

### Patch Changes

- Updated dependencies [5249594c5]
- Updated dependencies [56e4eb589]
- Updated dependencies [e37c0a005]
- Updated dependencies [f00ca3cb8]
- Updated dependencies [6579769df]
- Updated dependencies [8c2b76e45]
- Updated dependencies [440a17b39]
- Updated dependencies [8afce088a]
- Updated dependencies [7bbeb049f]
  - @backstage/backend-common@0.2.0
