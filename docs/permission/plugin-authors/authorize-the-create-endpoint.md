---
id: authorize-the-create-endpoint
title: Authorize the create endpoint
description: Authorize the create endpoint
---

The first step we need to do in order to authorize the create endpoint, is to create a new `permission` inside our backend plugin.

Install the following module:

```
$ yarn workspace @internal/plugin-todo-list-backend add @backstage/plugin-permission-common
```

Let's create a new `permissions.ts` file under `plugins/todo-list-backend/src/service/permissions.ts` with the following content:

```typescript
import { Permission } from '@backstage/plugin-permission-common';

export const TODO_LIST_RESOURCE_TYPE = 'todo-item';

export const todosListCreate: Permission = {
  name: 'todos.list.create',
  attributes: {
    action: 'create',
  },
};

export const todosListUpdate: Permission = {
  name: 'todos.list.update',
  attributes: {
    action: 'update',
  },
  resourceType: TODO_LIST_RESOURCE_TYPE,
};

export const todosListRead: Permission = {
  name: 'todos.list.read',
  attributes: {
    action: 'read',
  },
  resourceType: TODO_LIST_RESOURCE_TYPE,
};
```

The file contains all the permissions that we are going to use in the next steps.

Let's authorize the create endpoint.

Authorizing this endpoint now means that the adopters could decide whether some users should be allowed or not allowed to perform the create operation.

Edit `plugins/todo-list-backend/src/service/router.ts`:

```diff
- import { InputError } from '@backstage/errors';
+ import { InputError, NotAllowedError } from '@backstage/errors';
  import { add, getAll, getTodo, Todo, TodoFilter, update } from './todos';
+ import { PermissionAuthorizer, AuthorizeResult } from '@backstage/plugin-permission-common';
+ import { todosListCreate } from './permissions';


  export interface RouterOptions {
    logger: Logger;
    identity: IdentityClient;
+   permissions: PermissionAuthorizer;
  }

  export async function createRouter(
    options: RouterOptions,
  ): Promise<express.Router> {
-   const { logger, identity } = options;
+   const { logger, identity, permissions } = options;

    ...

    router.post('/todos', async (req, res) => {
      const token = IdentityClient.getBearerToken(req.header('authorization'));
      let author: string | undefined = undefined;

      const user = token ? await identity.authenticate(token) : undefined;
      author = user?.identity.userEntityRef;
+     const decision = (
+       await permissions.authorize([{ permission: todosListCreate }], {
+       token,
+       })
+     )[0];

+     if (decision.result === AuthorizeResult.DENY) {
+       throw new NotAllowedError('Unauthorized');
+     }

      if (!isTodoCreateRequest(req.body)) {
        throw new InputError('Invalid payload');
      }

      const todo = add({ title: req.body.title, author });
      res.json(todo);
  });

```

Pass the `permissions` object to the plugin in `packages/backend/src/plugins/todolist.ts`:

```diff
  import { IdentityClient } from '@backstage/plugin-auth-backend';
  import { createRouter } from '@internal/plugin-todo-list-backend';
  import { Router } from 'express';
  import { PluginEnvironment } from '../types';

  export default async function createPlugin({
    logger,
    discovery,
+   permissions,
  }: PluginEnvironment): Promise<Router> {
    return await createRouter({
      logger,
      identity: new IdentityClient({
        discovery,
        issuer: await discovery.getExternalBaseUrl('auth'),
      }),
+     permissions,
    });
  }
```

That's it! Now your plugin is fully configured.

Let's try to test the logic by denying the permission.

### Test the authorized create endpoint

In order to test the logic above, the integrators of your backstage instance need to deny change their permission policy in `packages/backend/src/plugins/permission.ts`:

```diff
- import { IdentityClient } from '@backstage/plugin-auth-node';
+ import { BackstageIdentityResponse, IdentityClient } from '@backstage/plugin-auth-node';
  import {
    PermissionPolicy,
+   PolicyAuthorizeQuery,
    PolicyDecision,
  } from '@backstage/plugin-permission-node';

- class AllowAllPermissionPolicy implements PermissionPolicy
+ class MyPermissionPolicy implements PermissionPolicy {
-   async handle(): Promise<PolicyDecision> {
+   async handle(
+     request: PolicyAuthorizeQuery,
+     user?: BackstageIdentityResponse,
+   ): Promise<PolicyDecision> {
+     if (request.permission.name === 'todos.list.create') {
+       return {
+         result: AuthorizeResult.DENY,
+       };
+     }
      return {
        result: AuthorizeResult.ALLOW,
      };
  }

  export default async function createPlugin({
    discovery,
    logger,
  }: PluginEnvironment) {
-   const policy = new AllowAllPermissionPolicy();
+   const policy = new MyPermissionPolicy();
    ...

  }
```

Now the frontend should show an error whenever you try to create a new Todo item.

Let's flip the result back to `ALLOW`:

```diff
        if (request.permission.attributes.action === 'create') {
          return {
-           result: AuthorizeResult.DENY,
+           result: AuthorizeResult.ALLOW,
          };
```

now the create endpoint should be enabled again.
