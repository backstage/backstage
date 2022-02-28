---
id: authorize-the-read-endpoint
title: Authorize the read endpoint
description: Authorize the read endpoint
---

Authorizing `GET /todos` is similar to the update endpoint, in that it should be possible to authorize read access to todo entries based on their characteristics. When a `GET /todos` request is received, only the items that the user is permitted to see should be returned.

As in the previous case, the permission policy can't take the decision itself, meaning that a conditional decision should be returned.
However, this time rather than a single `resourceRef` we have a whole list of resources to authorize.

Potentially, something like this could be done:

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

This should do the trick. However, this approach has a downside. It would force us to retrieve all the elements upfront and authorize them one by one, and mean that concerns like pagination that are handled by the data source today also need to move into the plugin.

To avoid this situation, the permissions framework has support for filtering items in the data source itself.

Update `plugins/todo-list-backend/src/service/rules.ts`

```diff
  import { makeCreatePermissionRule } from '@backstage/plugin-permission-node';
- import { Todo } from './todos';
+ import { Todo, TodoFilter } from './todos';

  const createTodoListPermissionRule = makeCreatePermissionRule<
    Todo,
-   undefined
+   TodoFilter
  >();

  export const isOwner = createTodoListPermissionRule({
    name: 'IS_OWNER',
    description: 'Should allow only if the todo belongs to the user',
    apply: (resource, userId) => {
      return resource.author === userId;
    },
    toQuery: userId => {
-     throw new Error('toQuery not implemented');
+     return resource => resource.author === userId;
    },
  });
```

`plugins/todo-list-backend/src/service/router.ts`

```diff
- import { createPermissionIntegrationRouter } from '@backstage/plugin-permission-node';
+ import {
+   createPermissionIntegrationRouter,
+   createConditionTransformer,
+   ConditionTransformer,
+ } from '@backstage/plugin-permission-node';
  import {
    todosListCreate,
    todosListUpdate,
+   todosListRead,
    TODO_LIST_RESOURCE_TYPE,
  } from './permissions';

  router.get('/todos', async (req, res) => {
+   const token = getBearerTokenFromAuthorizationHeader(
+     req.header('authorization'),
+   );
+   const decision = (
+     await permissions.authorize([{ permission: todosListRead }], {
+       token,
+     })
+   )[0];
+   if (decision.result === AuthorizeResult.DENY) {
+     throw new NotAllowedError('Unauthorized');
+   }

+   if (decision.result === AuthorizeResult.CONDITIONAL) {
+     const conditionTransformer: ConditionTransformer<TodoFilter> =
+       createConditionTransformer(rules);
+     const filter = conditionTransformer(decision.conditions) as TodoFilter;
+     res.json(getAll(filter));
+     return;
+   }

   res.json(getAll());
  });
```

In this case, we are not passing any `resourceRef` when invoking `permissions.authorize()`.

Since there is no `resourceRef` and the permission policy is returning a conditional response, the permission framework can't make a decision
on its own and it's expecting the todo list backend's router to take care of this case.

Instead of authorizing every todo item one by one, we can implement this more efficiently.

If all the items were stored in a database, we could transform each permission result in the proper database query, letting the database do the filtering.

If this approach is not applicable, you can still use the result-by-result authorization approach mentioned at the beginning of the section.

Fortunately, our todo service is smart enough and lets us pass an optional `filter` function when invoking `getAll()`.
This is exactly what the `toQuery` field in the permission rule does.

In this particular example, the `isOwner` rule returns a function (expected by `getAll` method). But there is no constraint regarding the shape of the returned object: any type of data can be returned.

Now let's update our permission policy's handler to return a conditional result whenever a todosListCreate permission is received. We could reuse the same result as the update action:

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
