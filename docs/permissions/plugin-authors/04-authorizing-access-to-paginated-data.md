---
id: 04-authorizing-access-to-paginated-data
title: 4. Authorizing access to paginated data
description: Explains how to authorize access to paginated data in a Backstage plugin
---

:::info
This documentation is written for [the new backend system](../../backend-system/index.md) which is the default since Backstage [version 1.24](../../releases/v1.24.0.md). If you are still on the old backend system, you may want to read [its own article](./04-authorizing-access-to-paginated-data--old.md) instead, and [consider migrating](../../backend-system/building-backends/08-migrating.md)!
:::

Authorizing `GET /todos` is similar to the update endpoint, in that it should be possible to authorize access based on the characteristics of each resource. However, we'll need to authorize a list of resources for this endpoint.

One possible solution may leverage the batching functionality to authorize all of the todos, and then returning only the ones for which the decision was `ALLOW`:

```ts
router.get('/todos', async (req, res) => {
  /* highlight-add-next-line */
  const credentials = await httpAuth.credentials(req, { allow: ['user'] });

  /* highlight-remove-next-line */
  res.json(getAll());
  /* highlight-add-start */
  const items = getAll();
  const decisions = await permissions.authorize(
    items.map(({ id }) => ({
      permission: todoListReadPermission,
      resourceRef: id,
    })),
    { credentials },
  );

  const filteredItems = decisions.filter(
    decision => decision.result === AuthorizeResult.ALLOW,
  );
  res.json(filteredItems);
  /* highlight-add-end */
});
```

This approach will work for simple cases, but it has a downside: it forces us to retrieve all the elements upfront and authorize them one by one. This forces the plugin implementation to handle concerns like pagination, which is currently handled by the data source.

To avoid this situation, the permissions framework has support for filtering items in the data source itself. In this part of the tutorial, we'll describe the steps required to use that behavior.

:::note Note

In order to perform authorization filtering in this way, the data source must allow filters to be logically combined with AND, OR, and NOT operators. The conditional decisions returned by the permissions framework use a [nested object](https://backstage.io/docs/reference/plugin-permission-common.permissioncriteria) to combine conditions. If you're implementing a filter API from scratch, we recommend using the same shape for ease of interoperability. If not, you'll need to implement a function which transforms the nested object into your own format.

:::

## Creating the read permission

Let's add another permission to the plugin.

```ts title="plugins/todo-list-backend/src/service/permissions.ts"
import { createPermission } from '@backstage/plugin-permission-common';

export const TODO_LIST_RESOURCE_TYPE = 'todo-item';

export const todoListCreatePermission = createPermission({
  name: 'todo.list.create',
  attributes: { action: 'create' },
});

export const todoListUpdatePermission = createPermission({
  name: 'todo.list.update',
  attributes: { action: 'update' },
  resourceType: TODO_LIST_RESOURCE_TYPE,
});

/* highlight-add-start */
export const todoListReadPermission = createPermission({
  name: 'todos.list.read',
  attributes: { action: 'read' },
  resourceType: TODO_LIST_RESOURCE_TYPE,
});
/* highlight-add-end */

export const todoListPermissions = [
  todoListCreatePermission,
  todoListUpdatePermission,
  /* highlight-add-start */
  todoListReadPermission,
  /* highlight-add-end */
];
```

## Using conditional policy decisions

As usual, we'll start by updating the permission integration to include the new permission:

```ts title="plugins/todo-list-backend/src/plugin.ts"
import {
  TODO_LIST_RESOURCE_TYPE,
  todoListCreatePermission,
  todoListUpdatePermission,
  /* highlight-add-next-line */
  todoListReadPermission,
} from '@internal/plugin-todo-list-common';

// ...

permissionsRegistry.addResourceType({
  resourceRef: todoListPermissionResourceRef,
  /* highlight-remove-next-line */
  permissions: [todoListCreatePermission, todoListUpdatePermission],
  /* highlight-add-next-line */
  permissions: [
    todoListCreatePermission,
    todoListUpdatePermission,
    todoListReadPermission,
  ],
  rules: Object.values(rules),
  getResources: async resourceRefs => {
    return Promise.all(resourceRefs.map(getTodo));
  },
});
```

So far we've only used the `PermissionsService.authorize` method, which will evaluate conditional decisions before returning a result. In this step, we want to evaluate conditional decisions within our plugin, so we'll use `PermissionsService.authorizeConditional` instead.

```ts title="plugins/todo-list-backend/src/service/router.ts"
/* highlight-add-start */
import {
  createConditionTransformer,
  ConditionTransformer,
} from '@backstage/plugin-permission-node';
/* highlight-add-end */
/* highlight-remove-next-line */
import { add, getAll, getTodo, update } from './todos';
/* highlight-add-next-line */
import { add, getAll, getTodo, TodoFilter, update } from './todos';
/* highlight-add-next-line */
import { todoListPermissionResourceRef } from './rules';
import {
  todoListCreatePermission,
  todoListUpdatePermission,
  /* highlight-add-next-line */
  todoListReadPermission,
} from '@internal/plugin-todo-list-common';

// ...

/* highlight-add-start */
const transformConditions = createConditionTransformer(
  permissionsRegistry.getPermissionRuleset(todoListPermissionResourceRef)
);
/* highlight-add-end */

/* highlight-remove-next-line */
router.get('/todos', async (_req, res) => {
/* highlight-add-start */
router.get('/todos', async (req, res) => {
  const credentials = await httpAuth.credentials(req, { allow: ['user'] });

  const decision = (
    await permissions.authorizeConditional([{ permission: todoListReadPermission }], {
      credentials,
    })
  )[0];

  if (decision.result === AuthorizeResult.DENY) {
    throw new NotAllowedError('Unauthorized');
  }

  if (decision.result === AuthorizeResult.CONDITIONAL) {
    const filter = transformConditions(decision.conditions);
    res.json(getAll(filter));
  } else {
    res.json(getAll());
  }
/* highlight-add-end */
  /* highlight-remove-next-line */
  res.json(getAll());
});
```

To make the process of handling conditional decisions easier, the permission framework provides a `createConditionTransformer` helper. This function accepts an array of permission rules, and returns a transformer function which converts the conditions to the format needed by the plugin using the `toQuery` method defined on each rule.

Since `TodoFilter` used in our plugin matches the structure of the conditions object, we can directly pass the output of our condition transformer. If the filters were structured differently, we'd need to transform it further before passing it to the api.

## Test the authorized read endpoint

Let's update our permission policy to return a conditional result whenever a `todoListReadPermission` permission is received. In this case, we can reuse the decision returned for the `todosListCreate` permission.

```ts title="packages/backend/src/plugins/permission.ts"
import {
  todoListCreatePermission,
  todoListUpdatePermission,
  /* highlight-add-next-line */
  todoListReadPermission,
} from '@internal/plugin-todo-list-common';

/* highlight-remove-next-line */
if (isPermission(request.permission, todoListUpdatePermission)) {
/* highlight-add-start */
if (
  isPermission(request.permission, todoListUpdatePermission) ||
  isPermission(request.permission, todoListReadPermission)
) {
/* highlight-add-end */
  return createTodoListConditionalDecision(
    request.permission,
    todoListConditions.isOwner({
      userId: user?.identity.userEntityRef
    }),
  );
}
```

Once the changes to the permission policy are saved, the UI should show only the todo items you've created.
