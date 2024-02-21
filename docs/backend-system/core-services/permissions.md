---
id: permissions
title: Permissions Service
sidebar_label: Permissions
description: Documentation for the Permissions service
---

This service allows your plugins to ask [the permissions framework](https://backstage.io/docs/permissions/overview) for authorization of user actions.

## Using the service

The following example shows how to get the permissions service in your `example` backend to check to see if the user is allowed to perform a certain action with a custom permission rule.

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
        permissions: coreServices.permissions,
        http: coreServices.httpRouter,
      },
      async init({ permissions, http }) {
        const router = Router();
        router.get('/test-me', (request, response) => {
          // use the identity service to pull out the token from request headers
          const { token } = await identity.getIdentity({
            request,
          });

          // ask the permissions framework what the decision is for the permission
          const permissionResponse = await permissions.authorize(
            [
              {
                permission: myCustomPermission,
              },
            ],
            { token },
          );
        });

        http.use(router);
      },
    });
  },
});
```
