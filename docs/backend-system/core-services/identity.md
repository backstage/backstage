---
id: identity
title: Identity Service
sidebar_label: Identity
description: Documentation for the Identity service
---

:::note Note

This service is deprecated, you are likely looking for the [Auth Service](./auth.md) instead. If you're wondering how to get the user's entity ref and ownership claims in your backend plugin, you should see the [User Info Service](./user-info.md) documentation.

:::

When working with backend plugins, you might find that you will need to interact with the `auth-backend` plugin to both authenticate backstage tokens, and to deconstruct them to get the user's entity ref and/or ownership claims out of them.

## Using the service

The following example shows how to get the identity service in your `example` backend plugin and retrieve the user's entity ref and ownership claims for the incoming request.

```ts
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { Router } from 'express';

createBackendPlugin({
  pluginId: 'example',
  register(env) {
    env.registerInit({
      deps: {
        identity: coreServices.identity,
        http: coreServices.httpRouter,
      },
      async init({ http, identity }) {
        const router = Router();
        router.get('/test-me', (request, response) => {
          // use the identity service to pull out the header from the request and get the user
          const {
            identity: { userEntityRef, ownershipEntityRefs },
          } = await identity.getIdentity({
            request,
          });

          // send the decoded and validated things back to the user
          response.json({
            userEntityRef,
            ownershipEntityRefs,
          });
        });

        http.use(router);
      },
    });
  },
});
```

## Configuring the service

There's additional configuration that you can optionally pass to setup the `identity` core service.

- `issuer` - Set an optional issuer for validation of the JWT token
- `algorithms` - `alg` header for validation of the JWT token, defaults to `ES256`. More info on supported algorithms can be found in the [`jose` library documentation](https://github.com/panva/jose)

You can configure these additional options by adding an override for the core service when calling `createBackend` like follows:

```ts
import { identityServiceFactory } from '@backstage/backend-app-api';

const backend = createBackend();

backend.add(
  identityServiceFactory({
    issuer: 'backstage',
    algorithms: ['ES256', 'RS256'],
  }),
);
```
