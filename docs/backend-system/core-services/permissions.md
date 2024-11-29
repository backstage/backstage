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
import { NotAllowedError } from '@backstage/errors';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import Router from 'express-promise-router';

export default createBackendPlugin({
  pluginId: 'example',
  register(env) {
    env.registerInit({
      deps: {
        permissions: coreServices.permissions,
        httpRouter: coreServices.httpRouter,
        httpAuth: coreServices.httpAuth,
      },
      async init({ permissions, httpRouter, httpAuth }) {
        const endpoints = Router();
        endpoints.get('/test-me', (request, response) => {
          // Ask the permissions framework what the decision is for the given
          // permission, for the principal that made the original request. The
          // `httpAuth` service helps us extract those credentials. We authorize
          // a single permission here, so the result will be an array with one
          // element accordingly.
          const permissionResponse = await permissions.authorize(
            [{ permission: myCustomPermission }],
            { credentials: await httpAuth.credentials(request) },
          );

          if (permissionResponse[0].result !== AuthorizeResult.ALLOW) {
            throw new NotAllowedError(
              'You are not permitted to perform this action',
            );
          }

          // TODO: Actual code goes here
        });

        httpRouter.use(endpoints);
      },
    });
  },
});
```
