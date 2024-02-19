---
id: 03-adding-a-resource-permission-check
title: 3. Adding a resource permission check
description: Explains how to add a resource permission check to a Backstage plugin
---

When performing updates (or other operations) on specific [resources](../../references/glossary.md#resource-permission-plugin), the permissions framework allows for the decision to be based on characteristics of the resource itself. This means that it's possible to write policies that (for example) allow the operation for users that own a resource, and deny the operation otherwise.

## Creating the update permission

Let's add a new permission to the file `plugins/todo-list-common/src/permissions.ts` from [the previous section](./02-adding-a-basic-permission-check.md).

```ts title="plugins/todo-list-common/src/permissions.ts"
import { createPermission } from '@backstage/plugin-permission-common';

/* highlight-add-next-line */
export const TODO_LIST_RESOURCE_TYPE = 'todo-item';

export const todoListCreatePermission = createPermission({
  name: 'todo.list.create',
  attributes: { action: 'create' },
});

/* highlight-add-start */
export const todoListUpdatePermission = createPermission({
  name: 'todo.list.update',
  attributes: { action: 'update' },
  resourceType: TODO_LIST_RESOURCE_TYPE,
});
/* highlight-add-end */

/* highlight-remove-next-line */
export const todoListPermissions = [todoListCreatePermission];
/* highlight-add-start */
export const todoListPermissions = [
  todoListCreatePermission,
  todoListUpdatePermission,
];
/* highlight-add-end */
```

Notice that unlike `todoListCreatePermission`, the `todoListUpdatePermission` permission contains a `resourceType` field. This field indicates to the permission framework that this permission is intended to be authorized in the context of a resource with type `'todo-item'`. You can use whatever string you like as the resource type, as long as you use the same value consistently for each type of resource.

## Setting up authorization for the update permission

To start, let's edit `plugins/todo-list-backend/src/service/router.ts` in the same manner as we did in the previous section:

```ts title="plugins/todo-list-backend/src/service/router.ts"
/* highlight-remove-next-line */
import { todoListCreatePermission } from '@internal/plugin-todo-list-common';
/* highlight-add-start */
import {
  todoListCreatePermission,
  todoListUpdatePermission,
} from '@internal/plugin-todo-list-common';
/* highlight-add-end */

// ...

const permissionIntegrationRouter = createPermissionIntegrationRouter({
  /* highlight-remove-next-line */
  permissions: [todoListCreatePermission],
  /* highlight-add-next-line */
  permissions: [todoListCreatePermission, todoListUpdatePermission],
});

// ...

router.put('/todos', async (req, res) => {
  /* highlight-add-start */
  const token = getBearerTokenFromAuthorizationHeader(
    req.header('authorization'),
  );
  /* highlight-add-end */

  if (!isTodoUpdateRequest(req.body)) {
    throw new InputError('Invalid payload');
  }
  /* highlight-add-start */
  const decision = (
    await permissions.authorize(
      [{ permission: todoListUpdatePermission, resourceRef: req.body.id }],
      {
        token,
      },
    )
  )[0];

  if (decision.result !== AuthorizeResult.ALLOW) {
    throw new NotAllowedError('Unauthorized');
  }
  /* highlight-add-end */

  res.json(update(req.body));
});
```

**Important:** Notice that we are passing an extra `resourceRef` field, with the `id` of the todo item as the value.

This enables decisions based on characteristics of the resource, but it's important to note that policy authors will not have access to the resource ref inside of their permission policies. Instead, the policies will return conditional decisions, which we need to now support in our plugin.

## Adding support for conditional decisions

Install the missing module:

```bash
$ yarn workspace @internal/plugin-todo-list-backend add zod
```

Create a new `plugins/todo-list-backend/src/service/rules.ts` file and append the following code:

```typescript title="plugins/todo-list-backend/src/service/rules.ts"
import { makeCreatePermissionRule } from '@backstage/plugin-permission-node';
import { TODO_LIST_RESOURCE_TYPE } from '@internal/plugin-todo-list-common';
import { z } from 'zod';
import { Todo, TodoFilter } from './todos';

export const createTodoListPermissionRule = makeCreatePermissionRule<
  Todo,
  TodoFilter,
  typeof TODO_LIST_RESOURCE_TYPE
>();

export const isOwner = createTodoListPermissionRule({
  name: 'IS_OWNER',
  description: 'Should allow only if the todo belongs to the user',
  resourceType: TODO_LIST_RESOURCE_TYPE,
  paramsSchema: z.object({
    userId: z.string().describe('User ID to match on the resource'),
  }),
  apply: (resource: Todo, { userId }) => {
    return resource.author === userId;
  },
  toQuery: ({ userId }) => {
    return {
      property: 'author',
      values: [userId],
    };
  },
});

export const rules = { isOwner };
```

`makeCreatePermissionRule` is a helper used to ensure that rules created for this plugin use consistent types for the resource and query.

> Note: To support custom rules defined by Backstage integrators, you must export `createTodoListPermissionRule` from the backend package and provide some way for custom rules to be passed in before the backend starts, likely via `createRouter`.

We have created a new `isOwner` rule, which is going to be automatically used by the permission framework whenever a conditional response is returned in response to an authorized request with an attached `resourceRef`.
Specifically, the `apply` function is used to understand whether the passed resource should be authorized or not.

Let's skip the `toQuery` function for now, we'll come back to that in the next section.

Now, let's create the new endpoint by editing `plugins/todo-list-backend/src/service/router.ts`. This uses the `createPermissionIntegrationRouter` helper to add the APIs needed by the permission framework to your plugin. You'll need to supply:

- `getResources`: a function that accepts an array of `resourceRefs` in the same format you expect to be passed to `authorize`, and returns an array of the corresponding resources.
- `resourceType`: the same value used in the permission rule above.
- `permissions`: the list of permissions that your plugin accepts.
- `rules`: an array of all the permission rules you want to support in conditional decisions.

```ts title="plugins/todo-list-backend/src/service/router.ts"
// ...
import {
  /* highlight-add-next-line */
  TODO_LIST_RESOURCE_TYPE,
  todoListCreatePermission,
  todoListUpdatePermission,
} from '@internal/plugin-todo-list-common';
/* highlight-remove-next-line */
import { add, getAll, update } from './todos';
/* highlight-add-start */
import { add, getAll, getTodo, update } from './todos';
import { rules } from './rules';
/* highlight-add-end */

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, identity, permissions } = options;

  const permissionIntegrationRouter = createPermissionIntegrationRouter({
    permissions: [todoListCreatePermission, todoListUpdatePermission],
    /* highlight-add-start */
    getResources: async resourceRefs => {
      return resourceRefs.map(getTodo);
    },
    resourceType: TODO_LIST_RESOURCE_TYPE,
    rules: Object.values(rules),
    /* highlight-add-end */
  });

  const router = Router();
  router.use(express.json());

  // ...
}
```

## Provide utilities for policy authors

Now that we have a new resource type and a corresponding rule, we need to export some utilities for policy authors to reference them.

Create a new `plugins/todo-list-backend/src/conditionExports.ts` file and add the following code:

```typescript title="plugins/todo-list-backend/src/conditionExports.ts"
import { TODO_LIST_RESOURCE_TYPE } from '@internal/plugin-todo-list-common';
import { createConditionExports } from '@backstage/plugin-permission-node';
import { rules } from './service/rules';

const { conditions, createConditionalDecision } = createConditionExports({
  pluginId: 'todolist',
  resourceType: TODO_LIST_RESOURCE_TYPE,
  rules,
});

export const todoListConditions = conditions;

export const createTodoListConditionalDecision = createConditionalDecision;
```

Make sure `todoListConditions` and `createTodoListConditionalDecision` are exported from the `todo-list-backend` package by editing `plugins/todo-list-backend/src/index.ts`:

```ts title="plugins/todo-list-backend/src/index.ts"
export * from './service/router';
/* highlight-add-next-line */
export * from './conditionExports';
export { exampleTodoListPlugin } from './plugin';
```

## Test the authorized update endpoint

Let's go back to the permission policy's handle function and try to authorize our new permission with an `isOwner` condition.

```ts title="packages/backend/src/plugins/permission.ts"
import {
  BackstageIdentityResponse,
  IdentityClient
} from '@backstage/plugin-auth-node';
import {
  PermissionPolicy,
  PolicyQuery,
} from '@backstage/plugin-permission-node';
import { isPermission } from '@backstage/plugin-permission-common';
/* highlight-remove-next-line */
import { todoListCreatePermission } from '@internal/plugin-todo-list-common';
/* highlight-add-start */
import {
  todoListCreatePermission,
  todoListUpdatePermission,
} from '@internal/plugin-todo-list-common';
import {
  todoListConditions,
  createTodoListConditionalDecision,
} from '@internal/plugin-todo-list-backend';
/* highlight-add-end */


async handle(
  request: PolicyQuery,
  /* highlight-remove-next-line */
  _user?: BackstageIdentityResponse,
  /* highlight-add-next-line */
  user?: BackstageIdentityResponse,
): Promise<PolicyDecision> {
  if (isPermission(request.permission, todoListCreatePermission)) {
    return {
      result: AuthorizeResult.ALLOW,
    };
  }
  /* highlight-add-start */
  if (isPermission(request.permission, todoListUpdatePermission)) {
    return createTodoListConditionalDecision(
      request.permission,
      todoListConditions.isOwner({
        userId: user?.identity.userEntityRef ?? '',
      }),
    );
  }
  /* highlight-add-end */

  return {
    result: AuthorizeResult.ALLOW,
  };
}
```

For any incoming update requests, we now return a _Conditional Decision_. We are saying:

> Hey permission framework, I can't make a decision alone. Please go to the plugin with id `todolist` and ask it to apply these conditions.

To check that everything works as expected, you should now see an error in the UI whenever you try to edit an item that wasn’t created by you. Success!
