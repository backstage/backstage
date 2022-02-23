---
id: permission-framework-for-plugin-authors
title: Permission Framework for plugin authors
description: How to get started with the permission framework as a plugin author
---

The following tutorial is designed for plugin authors who already have knowledge about how to create a backstage plugin. We will provide a "TODO List" plugin to be used as a starting point.
After integrating the plugin into your application, we will guide you step by step in the process needed for adding support for permissions to your plugin.

If you want to add support for permissions to your own plugin, feel free to skip to the [next section](#authorize-the-create-endpoint).

## Setup for the Tutorial

We will use a "Todo list" feature, composed of the `todo-list` and `todo-list-backend` plugins.

The source code is available here:

- todo-list link-to-backstage-todo-list-plugin
- todo-list-backend link-to-backstage-todo-list-backend-plugin

1.  Copy-paste the two folders into the plugins folder of your backstage application repository. Your application structure should look something like this:

    ![backstage application files structure](../assets/permission/permission-tutorial-backstage-application-initial-structure.png)

2.  add the new plugin as a dependency of your app's backend module:

    ```
    $ yarn workspace app add @internal/plugin-todo-list@^1.0.0
    $ yarn workspace backend add @internal/plugin-todo-list-backend@^1.0.0
    ```

3.  Include the backend and frontend plugin in your application:

    Create a new `packages/backend/src/plugins/todolist.ts` with the following content:

    ```javascript
    import { IdentityClient } from '@backstage/plugin-auth-backend';
    import { createRouter } from '@internal/plugin-todo-list-backend';
    import { Router } from 'express';
    import { PluginEnvironment } from '../types';

    export default async function createPlugin({
      logger,
      discovery,
    }: PluginEnvironment): Promise<Router> {
      return await createRouter({
        logger,
        identity: new IdentityClient({
          discovery,
          issuer: await discovery.getExternalBaseUrl('auth'),
        }),
      });
    }
    ```

    Apply the following changes to `packages/backend/src/index.ts`:

    ```diff
      import techdocs from './plugins/techdocs';
    + import todoList from './plugins/todolist';
      import search from './plugins/search';

      ...

      const searchEnv = useHotMemoize(module, () => createEnv('search'));
      const appEnv = useHotMemoize(module, () => createEnv('app'));
    + const todoListEnv = useHotMemoize(module, () => createEnv('todolist'));

      ...

      apiRouter.use('/proxy', await proxy(proxyEnv));
      apiRouter.use('/search', await search(searchEnv));
      apiRouter.use('/permission', await permission(permissionEnv));
    + apiRouter.use('/todolist', await todoList(todoListEnv));
      // Add backends ABOVE this line; this 404 handler is the catch-all fallback
      apiRouter.use(notFoundHandler());
    ```

    Apply the following changes to `packages/app/src/App.ts`:

    ```diff
    + import { TodoListPage } from '@internal/plugin-todo-list';

    ...

        <Route path="/search" element={<SearchPage />}>
          {searchPage}
        </Route>
        <Route path="/settings" element={<UserSettingsPage />} />
    +   <Route path="/todo-list" element={<TodoListPage />} />
      </FlatRoutes>
    ```

Now if you start your application you should be able to reach the `/todo-list` page:

![Todo List plugin page](../assets/permission/permission-todo-list-page.png)

---

## Integrate the new plugin

If you play with the UI, you will notice that it is possible to perform a few actions:

- create a new todo item (`POST /todos`)
- view todo items (`GET /todos`)
- edit an existing todo item (`PUT /todos`)

Let's try to bring authorization on top of each one of them.

## Authorize the create endpoint

The first step we need to do in order to authorize the create endpoint, is to create a new `permission` inside our backend plugin.

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

Let's authorize the create endpoint. Edit `plugins/todo-list-backend/src/service/router.ts`:

```diff

  import { add, getAll, getTodo, Todo, TodoFilter, update } from './todos';
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

- class AllowAllPermissionPolicy implements PermissionPolicy
+ class MyPermissionPolicy implements PermissionPolicy {
    async handle(
      request: PolicyAuthorizeQuery,
      user?: BackstageIdentityResponse,
    ): Promise<PolicyDecision> {
+     if (request.permission.resourceType === 'todos-list') {
+       if (request.permission.attributes.action === 'create') {
+         return {
+           result: AuthorizeResult.DENY,
+         };
+       }
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

## Authorize the update endpoint

When performing updates (or other operations) on specific resources, the permissions framework allows for the decision to be based on characteristics of the resource itself. This means that it's possible to write policies that (for example) allow the operation for users that own a resource, and deny the operation otherwise.

To start with, let's edit `plugins/todo-list-backend/src/service/router.ts` in a similar way as in the previous step.

```diff
- import { todosListCreate } from './permissions';
+ import { todosListCreate, todosListUpdate } from './permissions';

  ...


    router.put('/todos', async (req, res) => {
      const token = IdentityClient.getBearerToken(req.header('authorization'));

      if (!isTodoUpdateRequest(req.body)) {
        throw new InputError('Invalid payload');
      }
+     const decision = (
+       await permissions.authorize(
+         [{ permission: todosListUpdate, resourceRef: req.body.id }],
+         {
+           token,
+         },
+       )
+     )[0];

-     res.json(update(req.body));
+     if (decision.result === AuthorizeResult.ALLOW) {
+       res.json(update(req.body));
+       return;
+     }
+     throw new NotAllowedError('Unauthorized');
    });
```

**Important:** Notice that we are passing an extra `resourceRef` object, containing the `id` of the todo we want to authorize. This enables decisions based on characteristics of the resource, but it's important to note that to enable authorizing multiple resources at once, **the resourceRef is not passed to PermissionPolicy#handle**. Instead, policies must return a _conditional decision_.

Before diving into the extra steps needed for supporting conditional decisions, let's go back to the permission policy's handle function used by your adopters and try to authorize our new permission.

Let's edit `packages/backend/src/plugins/permission.ts`

```diff
    if (request.permission.resourceType === 'todos-list') {
      if (request.permission.attributes.action === 'create') {
        return {
          result: AuthorizeResult.ALLOW,
        };
      }
+     if (request.permission.attributes.action === 'update') {
+       return {
+         result: AuthorizeResult.CONDITIONAL,
+         pluginId: 'todolist',
+         resourceType: 'todo-list', // or whatever the resourceType ends up being
+         conditions: {
+           rule: 'IS_OWNER',
+           params: [user?.identity.userEntityRef],
+         },
+       };
+     }
    }
```

This is what happens when a _Conditional Decision_ is returned. We are saying:

> Hey permission framework, I can't make a decision alone. Please go to the plugin with id `todolist` and ask it to apply these conditions.

Now if we try to edit an item from the UI, we should spot the following error in the backend's console:

```
backstage error Unexpected response from plugin upstream when applying conditions.
Expected 200 but got 404 - Not Found type=errorHandler stack=Error:
Unexpected response from plugin upstream when applying conditions. Expected 200 but got 404 - Not Found
```

This happens because our plugin should have exposed a specific endpoint, used by the permission framework to apply conditional decisions. The new endpoint should also be able to support some conditions. In our case, `IS_OWNER` is the only type of condition we want to support.

Create a new `plugins/todo-list-backend/src/service/rules.ts` file and append the following code:

```diff
+ import { makeCreatePermissionRule } from '@backstage/plugin-permission-node';
+ import { Todo } from './todos';

+ const createTodoListPermissionRule = makeCreatePermissionRule<
+   Todo,
+   undefined
+ >();

+ export const isOwner = createTodoListPermissionRule({
+   name: 'IS_OWNER',
+   description: 'Should allow only if the todo belongs to the user',
+   apply: (resource, userId) => {
+     return resource.author === userId;
+   },
+   toQuery: userId => {
+     throw new Error('toQuery not implemented');
+   },
+ });

+ export const rules = [isOwner];
```

`makeCreatePermissionRule` is a helper used to ensure that rules created for this plugin use consistent types for the resource and query.

We have created a new `isOwner` rule, which is going to be automatically used by the permission framework whenever a conditional response is returned in response to an authorized request with an attached `resourceRef`.
Specifically, the `apply` function is used to understand whether the passed resource should be authorized or not.

Let's skip the `toQuery` function for now.

Now, let's create the new endpoint by editing `plugins/todo-list-backend/src/service/router.ts`:

```diff
- import { todosListCreate, todosListUpdate } from './permissions';
+ import { todosListCreate, todosListUpdate, TODO_LIST_RESOURCE_TYPE } from './permissions';
+ import { rules } from './rules;

  export async function createRouter(
    options: RouterOptions,
  ): Promise<express.Router> {
    const { logger, identity, permissions } = options;

+   const permissionIntegrationRouter = createPermissionIntegrationRouter({
+     getResources: async resourceRefs => {
+       return resourceRefs.map(getTodo);
+     },
+     resourceType: TODO_LIST_RESOURCE_TYPE,
+     rules,
+   });

    const router = Router();
    router.use(express.json());

+   router.use(permissionIntegrationRouter);

    router.post('/todos', async (req, res) => {
```

## Authorize the `GET /todos` endpoint

Authorizing the `GET /todos` is similar to the update endpoint: whenever a `GET /todos` request is received, only the items that the user has created should be returned.

As in the previous case, the permission policy can't take the decision itself, meaning that a conditional decision should be returned.
Also, here we don't have a `resourceRef` but a list of resources.

Potentially, something like this could be done:

```diff
    router.get('/todos', async (req, res) => {
      const token = IdentityClient.getBearerToken(req.header('authorization'));

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

  import {
    todosListCreate,
    todosListUpdate,
+   todosListRead,
    TODO_LIST_RESOURCE_TYPE,
  } from './permissions';

  router.get('/todos', async (req, res) => {
    const token = IdentityClient.getBearerToken(req.header('authorization'));
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
+     const filter = conditionTransformer(decision.conditions);
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

In case all the items are stored in a database. We could transform each permission result in the proper database query, letting the database do the filtering.

In case it's ok for you to proceed in a more simple approach, it's still possible to use the result-by-result authorization approach mentioned at the beginning of the section.

Fortunately, our todo service is smart enough and lets us pass an optional `filter` function when invoking `getAll()`.
This is exactly what the `toQuery` field in the permission rule does.

In this particular example, the `isOwner` rule returns a function (expected by `getAll` method). But there is no constraint regarding the shape of the returned object: any type of data can be returned.

If you want to know more about how existing plugins integrate with the permission framework, check `catalog-backend` here.
