---
id: backend-auth
title: Secure your backend
description: Documentation on securing your backend by requiring authentication.
---

##

By default, the backstage backend does not require authentication. Securing your backend requires additional configuration or a separate service like Google's Identity-Aware Proxy. Since the backend is served as an express app we can leverage express middleware to require JWT bearer tokens for all requests. The `@backstage/plugin-auth-node` package provides the `createRequireAuthenticationMiddleware` factory method for creating express middleware that can be used to secure your backend.

The middleware created by this factory only verifies that a valid JWT token is provided and thus adds **authentication** to the api endpoint. The middleware cannot check whether the identity enclosed in the token has access to specific resources (**authorisation**). Each plugin backend is responsible for checking the permissions of the identity in the token if required.

To configure all backend routes, except `/auth`, to require a valid user or server token, you can use the following code:

```ts title="packages/backend/src/index.ts"
// ...
/* highlight-add-start */
import { createRequireAuthenticationMiddleware } from '@backstage/plugin-auth-node';
/* highlight-add-end */

// ...
async function main() {
  // ...
  const createEnv = makeCreateEnv(config);
  // ...
  const appEnv = useHotMemoize(module, () => createEnv('app'));
  // ...
  /* highlight-add-start */
  const requireAuthentication = createRequireAuthenticationMiddleware(
    appEnv.identity,
    appEnv.tokenManager,
  );
  /* highlight-add-end */

  const apiRouter = Router();

  /* highlight-add-next-line */
  // unauthenticated routes
  apiRouter.use('/auth', await auth(authEnv));

  /* highlight-add-next-line */
  // authenticated routes
  apiRouter.use(
    '/catalog',
    /* highlight-add-start */ requireAuthentication,
    /* highlight-add-end */ await catalog(catalogEnv),
  );
  apiRouter.use(
    '/scaffolder',
    /* highlight-add-start */ requireAuthentication,
    /* highlight-add-end */ await scaffolder(scaffolderEnv),
  );
  apiRouter.use(
    '/techdocs',
    /* highlight-add-start */ requireAuthentication.unless({
      path: /^\/api\/techdocs\/static\/docs\/.+\.css/,
    }),
    /* highlight-add-end */ await techdocs(techdocsEnv),
  );
  // ...
}
```

> Note that for the `/techdocs` route you can use the [unless](https://github.com/jfromaniello/express-unless) method to allow requests to the static CSS files to be unauthenticated. This is because the `techdocs` plugin serves the CSS files from the backend, but the `techdocs` frontend requests them directly from the backend.

If your frontend components use the `@backstage/core-plugin-api` package to make requests to the backend, you can use the `FetchApi` to make API calls that will automatically add the required bearer token to each request.
