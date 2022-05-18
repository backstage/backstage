---
id: 04-authorizing-access-to-paginated-data
title: 4. Authorizing access to paginated data
description: Explains how to authorize access to paginated data in a Backstage plugin
---

Authorizing `GET /todos` is similar to the update endpoint, in that it should be possible to authorize access based on the characteristics of each resource. However, we'll need to authorize a list of resources for this endpoint.

One possible solution may leverage the batching functionality to authorize all of the todos, and then returning only the ones for which the decision was `ALLOW`:

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

This approach will work for simple cases, but it has a downside: it forces us to retrieve all the elements upfront and authorize them one by one. This forces the plugin implementation to handle concerns like pagination, which is currently handled by the data source.

To avoid this situation, the permissions framework has support for filtering items in the data source itself. In this part of the tutorial, we'll describe the steps required to use that behavior.

> Note: in order to perform authorization filtering in this way, the data source must allow filters to be logically combined with AND, OR, and NOT operators. The conditional decisions returned by the permissions framework use a [nested object](https://backstage.io/docs/reference/plugin-permission-common.permissioncriteria) to combine conditions. If you're implementing a filter API from scratch, we recommend using the same shape for ease of interoperability. If not, you'll need to implement a function which transforms the nested object into your own format.

## Creating the read permission

Let's add another permission to the plugin.

```diff
  // plugins/todo-list-backend/src/service/permissions.ts

  import { createPermission } from '@backstage/plugin-permission-common';

  export const TODO_LIST_RESOURCE_TYPE = 'todo-item';

  export const todoListCreate = createPermission({
    name: 'todo.list.create',
    attributes: { action: 'create' },
  });

  export const todoListUpdate = createPermission({
    name: 'todo.list.update',
    attributes: { action: 'update' },
    resourceType: TODO_LIST_RESOURCE_TYPE,
  });
+
+ export const todosListRead = createPermission({
+   name: 'todos.list.read',
+   attributes: { action: 'read' },
+   resourceType: TODO_LIST_RESOURCE_TYPE,
+ });
```

## Using conditional policy decisions

So far we've only used the `PermissionEvaluator.authorize` method, which will evaluate conditional decisions before returning a result. In this step, we want to evaluate conditional decisions within our plugin, so we'll use `PermissionEvaluator.authorizeConditional` instead.

```diff
// plugins/todo-list-backend/src/service/router.ts

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

+ const transformConditions: ConditionTransformer<TodoFilter> = createConditionTransformer(Object.values(rules));

- router.get('/todos', async (_req, res) => {
+ router.get('/todos', async (req, res) => {
+   const token = getBearerTokenFromAuthorizationHeader(
+     req.header('authorization'),
+   );
+
+   const decision = (
+     await permissions.authorizeConditional([{ permission: todosListRead }], {
+       token,
+     })
+   )[0];
+
+   if (decision.result === AuthorizeResult.DENY) {
+     throw new NotAllowedError('Unauthorized');
+   }
+
+   if (decision.result === AuthorizeResult.CONDITIONAL) {
+     const filter = transformConditions(decision.conditions);
+     res.json(getAll(filter));
+   } else {
+     res.json(getAll());
+   }
+ }
-   res.json(getAll());
  });
```

To make the process of handling conditional decisions easier, the permission framework provides a `createConditionTransformer` helper. This function accepts an array of permission rules, and returns a transformer function which converts the conditions to the format needed by the plugin using the `toQuery` method defined on each rule.

Since `TodoFilter` used in our plugin matches the structure of the conditions object, we can directly pass the output of our condition transformer. If the filters were structured differently, we'd need to transform it further before passing it to the api.

## Test the authorized read endpoint

Let's update our permission policy to return a conditional result whenever a `todosListRead` permission is received. In this case, we can reuse the decision returned for the `todosListCreate` permission.

```diff
// packages/backend/src/plugins/permission.ts

...

import {
  todoListCreate,
  todoListUpdate,
+ todoListRead,
  TODO_LIST_RESOURCE_TYPE,
} from '@internal/plugin-todo-list-common';

...

-   if (isPermission(request.permission, todoListUpdate)) {
+   if (
+     isPermission(request.permission, todoListUpdate) ||
+     isPermission(request.permission, todoListRead)
+   ) {
      return createTodoListConditionalDecision(
        request.permission,
        todoListConditions.isOwner(user?.identity.userEntityRef),
      );
    }
```

Once the changes to the permission policy are saved, the UI should show only the todo items you've created.
