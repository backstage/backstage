---
id: 02-adding-a-basic-permission-check
title: 2. Adding a basic permission check
description: Explains how to add a basic permission check to a Backstage plugin
---

If the outcome of a permission check doesn't need to change for different [resources](../concepts.md#resources-and-rules), you can use a _basic permission check_. For this kind of check, we simply need to define a [permission](../concepts.md#resources-and-rules), and call `authorize` with it.

For this tutorial, we'll use a basic permission check to authorize the `create` endpoint in our todo-backend. This will allow Backstage integrators to control whether each of their users is authorized to create todos by adjusting their [permission policy](../concepts.md#policy).

We'll start by creating a new permission, and then we'll use the permission api to call `authorize` with it during todo creation.

## Creating a new permission

Let's navigate to the file `plugins/todo-list-common/src/permissions.ts` and add our first permission:

```diff
  import { createPermission } from '@backstage/plugin-permission-common';

- export const tempExamplePermission = createPermission({
-   name: 'temp.example.noop',
-   attributes: {},
+ export const todoListCreate = createPermission({
+   name: 'todo.list.create',
+   attributes: { action: 'create' },
  });
```

For this tutorial, we've automatically exported all permissions from this file (see `plugins/todo-list-common/src/index.ts`).

> Note: All permissions authorized by your plugin should be exported from a ["common-library" package](https://backstage.io/docs/local-dev/cli-build-system#package-roles). This allows Backstage integrators to reference them in frontend components and permission policies.

## Authorizing using the new permission

Install the following module:

```
$ yarn workspace @internal/plugin-todo-list-backend \
  add @backstage/plugin-permission-common @internal/plugin-todo-list-common
```

Edit `plugins/todo-list-backend/src/service/router.ts`:

```diff
...

- import { InputError } from '@backstage/errors';
+ import { InputError, NotAllowedError } from '@backstage/errors';
+ import { PermissionEvaluator, AuthorizeResult } from '@backstage/plugin-permission-common';
+ import { todoListCreate } from '@internal/plugin-todo-list-common';

...

  export interface RouterOptions {
    logger: Logger;
    identity: IdentityClient;
+   permissions: PermissionEvaluator;
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
+       await permissions.authorize([{ permission: todoListCreate }], {
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

Before running this step, please make sure you followed the steps described in [Getting started](../getting-started.md) section.

In order to test the logic above, the integrators of your backstage instance need to change their permission policy to return `DENY` for our newly-created permission:

```diff
// packages/backend/src/plugins/permission.ts

- import { IdentityClient } from '@backstage/plugin-auth-node';
+ import {
+   BackstageIdentityResponse,
+   IdentityClient
+ } from '@backstage/plugin-auth-node';
  import {
    PermissionPolicy,
+   PolicyQuery,
  } from '@backstage/plugin-permission-node';
+ import { isPermission } from '@backstage/plugin-permission-common';
+ import { todoListCreate } from '@internal/plugin-todo-list-common';

  class TestPermissionPolicy implements PermissionPolicy {
-   async handle(): Promise<PolicyDecision> {
+   async handle(
+     request: PolicyQuery,
+     user?: BackstageIdentityResponse,
+   ): Promise<PolicyDecision> {
+     if (isPermission(request.permission, todoListCreate)) {
+       return {
+         result: AuthorizeResult.DENY,
+       };
+     }
+
      return {
        result: AuthorizeResult.ALLOW,
      };
  }
```

Now the frontend should show an error whenever you try to create a new Todo item.

Let's flip the result back to `ALLOW` before moving on.

```diff
  if (isPermission(request.permission, todoListCreate)) {
    return {
-     result: AuthorizeResult.DENY,
+     result: AuthorizeResult.ALLOW,
    };
  }
```
