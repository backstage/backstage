---
id: 02-adding-a-basic-permission-check
title: 2. Adding a basic permission check
description: Explains how to add a basic permission check to a Backstage plugin
---

If the outcome of a permission check doesn't need to change for different [resources](../concepts.md#resources-and-rules), you can use a _basic permission check_. For this kind of check, we simply need to define a [permission](../concepts.md#resources-and-rules), and call `authorize` with it.

For this tutorial, we'll use a basic permission check to authorize the `create` endpoint in our todo-backend. This will allow Backstage integrators to control whether each of their users is authorized to create todos by adjusting their [permission policy](../concepts.md#policy).

We'll start by creating a new permission, and then we'll use the permission api to call `authorize` with it during todo creation.

## Setup

Install the following module:

```
$ yarn workspace @internal/plugin-todo-list-backend \
    add @backstage/plugin-permission-common
```

## Creating a new permission

Let's create a new file `plugins/todo-list-backend/src/service/permissions.ts` with the following content:

```typescript
import { Permission } from '@backstage/plugin-permission-common';

export const todosListCreate: Permission = {
  name: 'todos.list.create',
  attributes: {
    action: 'create',
  },
};
```

We recommend exporting all permissions from your plugin, so that Backstage integrators can import them when writing policies.

## Authorizing using the new permission

Edit `plugins/todo-list-backend/src/service/router.ts`:

```diff
...

- import { InputError } from '@backstage/errors';
+ import { InputError, NotAllowedError } from '@backstage/errors';
+ import { PermissionAuthorizer, AuthorizeResult } from '@backstage/plugin-permission-common';
+ import { todosListCreate } from './permissions';

...

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

That's it! Now your plugin is fully configured. Let's try to test the logic by denying the permission.

## Test the authorized create endpoint

In order to test the logic above, the integrators of your backstage instance need to change their permission policy to return `DENY` for our newly-created permission:

```diff
// packages/backend/src/plugins/permission.ts

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
+
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

Now the create endpoint should be enabled again.
