---
id: setup-for-the-tutorial
title: Permission framework for plugin authors
description: How to get started with the permission framework as a plugin author
---

The following tutorial is designed for plugin authors who already have knowledge about how to create a backstage plugin. We will provide a "TODO List" plugin to be used as a starting point.
After integrating the plugin into your application, we will guide you step by step in the process needed for adding support for permissions to your plugin.

If you want to add support for permissions to your own plugin, feel free to skip to the [next section](authorize-the-create-endpoint.md).

## Setup for the Tutorial

We will use a "Todo list" feature, composed of the `todo-list` and `todo-list-backend` plugins.

The source code is available here:

- [todo-list](https://github.com/backstage/backstage/blob/master/contrib/plugins/todo-list)
- [todo-list-backend](https://github.com/backstage/backstage/blob/master/contrib/plugins/todo-list-backend)

1.  Copy-paste the two folders into the plugins folder of your backstage application repository. Your application structure should look something like this:

    ![backstage application files structure](../../assets/permission/permission-tutorial-backstage-application-initial-structure.png)

    // TODO: check if it's possible to automate this step

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

![Todo List plugin page](../../assets/permission/permission-todo-list-page.png)

---

## Integrate the new plugin

If you play with the UI, you will notice that it is possible to perform a few actions:

- create a new todo item (`POST /todos`)
- view todo items (`GET /todos`)
- edit an existing todo item (`PUT /todos`)

Let's try to bring authorization on top of each one of them.
