---
id: 04-authorizing-access-to-paginated-data
title: 4. Authorizing access to paginated data
description: Explains how to authorize access to paginated data in a Backstage plugin
---

Authorizing `GET /todos` is similar to the update endpoint, in that it should be possible to authorize read access to todo entries based on their characteristics. When a `GET /todos` request is received, only the items that the user is permitted to see should be returned.

As in the previous case, the permission policy can't take the decision itself, meaning that a conditional decision should be returned. However, this time rather than a single `resourceRef`, we have a whole list of resources to authorize.

Potentially, we could implement something like the below, leveraging the batching functionality to authorize all of the todos, and then returning only the ones for which the decision was `ALLOW`:

```diff
    router.get('/todos', async (req, res) => {
+     const token = IdentityClient.getBearerToken(req.header('authorization'));

-     res.json(getAll())
+     const items = getAll();
+     const decisions = await permissions.authorize(
+       items.map(({ id }) => ({ permission: todosListRead, resourceRef: id })),
+     );

+     const filteredItems = decisions.filter(
+       decision => decision.result === AuthorizeResult.ALLOW,
+     );
+     res.json(filteredItems);
    });
```

This approach will work for simple cases, but it has a downside: it forces us to retrieve all the elements upfront and authorize them one by one, and means that concerns like pagination that are handled by the data source today also need to move into the plugin.

To avoid this situation, the permissions framework has support for filtering items in the data source itself. In this tutorial, we'll create a permission for reading todo items, and use it to filter out unauthorized todo items in the data store itself.

> Note: in order to perform authorization filtering in this way, the data source must allow filters to be logically combined with AND, OR, and NOT operators. The conditional decisions returned by the permissions framework use a [nested object](https://backstage.io/docs/reference/plugin-permission-common.permissioncriteria) to combine conditions. If you're implementing a filter API from scratch, we recommend using the same shape for ease of interoperability. If not, you'll need to implement a function which transforms the nested object into your own format.

## Creating a new permission

Let's add another permission to the file `plugins/todo-list-backend/src/service/permissions.ts`, with the same structure as the existing `todosListUpdate` permission:

```diff
import { Permission } from '@backstage/plugin-permission-common';$$

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
+
+export const todosListRead: Permission = {
+  name: 'todos.list.read',
+  attributes: {
+    action: 'read',
+  },
+  resourceType: TODO_LIST_RESOURCE_TYPE,
+};
```

## Authorizing using the new permission

`plugins/todo-list-backend/src/service/router.ts`

```diff
- import { createPermissionIntegrationRouter } from '@backstage/plugin-permission-node';
+ import {
+   createPermissionIntegrationRouter,
+   createConditionTransformer,
+   ConditionTransformer,
+ } from '@backstage/plugin-permission-node';
- import { add, getAll, getTodo, update } from './todos';
+ import { add, getAll, getTodo, TodoFilter, update } from './todos';
  import {
    todosListCreate,
    todosListUpdate,
+   todosListRead,
    TODO_LIST_RESOURCE_TYPE,
  } from './permissions';
+ import { rules } from './rules';

  router.get('/todos', async (req, res) => {
+   const token = getBearerTokenFromAuthorizationHeader(
+     req.header('authorization'),
+   );
+
+   const decision = (
+     await permissions.authorize([{ permission: todosListRead }], {
+       token,
+     })
+   )[0];
+
+   if (decision.result === AuthorizeResult.DENY) {
+     throw new NotAllowedError('Unauthorized');
+   }
+
+   if (decision.result === AuthorizeResult.CONDITIONAL) {
+     const conditionTransformer: ConditionTransformer<TodoFilter> =
+       createConditionTransformer(Object.values(rules));
+     const filter = conditionTransformer(decision.conditions) as TodoFilter;
+     res.json(getAll(filter));
+   } else {
+     res.json(getAll());
+   }
+ }
-   res.json(getAll());
  });
```

In this case, we are not passing a `resourceRef` when invoking `permissions.authorize()`. Since there is no `resourceRef`, the permission framework can't apply conditions, and instead returns conditional decisions all the way back to the caller - in this case, the `todo-list-backend`.

To make the process of handling conditional decisions easier, the permission framework provides a `createConditionTransformer` helper. This function accepts an array of permission rules, and returns a transformer function which converts the conditions in conditional decisions to the format needed by the plugin using the `toQuery` method on permission rules.

Since the todo api groups filters using the same nested object structure as the permission framework, we can pass the output of our condition transformer straight to it. If the filters were grouped differently, we'd need to transform it at this point before passing it to the api.

## Test the authorized read endpoint

Let's update our permission policy's handler to return a conditional result whenever a todosListCreate permission is received. We could reuse the same result as the update action:

```diff
    if (request.permission.resourceType === 'todo-item') {
-     if (request.permission.resourceType === 'todo-item') {
+     if (
+         request.permission.attributes.action === 'update' ||
+         request.permission.attributes.action === 'read'
+     ) {
        return {
          result: AuthorizeResult.CONDITIONAL,
          pluginId: 'todolist',
          resourceType: 'todo-item',
          conditions: {
            rule: 'IS_OWNER',
            params: [user?.identity.userEntityRef],
          },
        };
      }
    }
```

Once the changes to the permission policy are saved, the UI should should show only the items you have created.

// TODO(vinzscam): add frontend documentation
