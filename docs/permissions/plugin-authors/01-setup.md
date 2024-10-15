---
id: 01-setup
title: 1. Tutorial setup
description: How to get started with the permission framework as a plugin author
---

:::info
This documentation is written for [the new backend system](../../backend-system/index.md) which is the default since Backstage [version 1.24](../../releases/v1.24.0.md). If you are still on the old backend system, you may want to read [its own article](./01-setup--old.md) instead, and [consider migrating](../../backend-system/building-backends/08-migrating.md)!
:::

The following tutorial is designed to help plugin authors add support for permissions to their plugins. We'll add support for permissions to example `todo-list` and `todo-list-backend` plugins, but the process should be similar for other plugins!

The rest of this page is focused on adding the `todo-list` and `todo-list-backend` plugins to your Backstage instance. If you want to add support for permissions to your own plugin instead, feel free to skip to the [next section](./02-adding-a-basic-permission-check.md).

## Setup for the Tutorial

**Note**: We will be updating files created as part of the [Getting Started](../getting-started.md) documentation, this tutorial assumes you have already viewed and gone through those steps!

We are going to make a "Todo list" feature, composed of the `todo-list` and `todo-list-backend` plugins, as well as their dependency, `todo-list-common`.

The source code is available here:

- [todo-list](https://github.com/backstage/backstage/blob/master/plugins/example-todo-list)
- [todo-list-backend](https://github.com/backstage/backstage/blob/master/plugins/example-todo-list-backend)
- [todo-list-common](https://github.com/backstage/backstage/blob/master/plugins/example-todo-list-common)

1. Copy-paste the three folders into the plugins folder of your backstage application repository (removing the `example-` prefix from each folder) or run the following script from the root of your backstage application:

   ```bash
   $ cd $(mktemp -d)
     git clone --depth 1 --quiet --no-checkout --filter=blob:none https://github.com/backstage/backstage.git .
     git checkout master -- plugins/example-todo-list/
     git checkout master -- plugins/example-todo-list-backend/
     git checkout master -- plugins/example-todo-list-common/
     sed -i '' 's/workspace:\^/\*/g' plugins/example-todo-list/package.json
     sed -i '' 's/workspace:\^/\*/g' plugins/example-todo-list-backend/package.json
     sed -i '' 's/workspace:\^/\*/g' plugins/example-todo-list-common/package.json
     for file in plugins/*; do mv "$file" "$OLDPWD/${file/example-todo/todo}"; done
     cd -
   ```

   The `plugins` directory of your project should now include `todo-list`, `todo-list-backend`, and `todo-list-common`.

   **Important**: if you are on **Windows**, make sure you have WSL and git installed on your machine before executing the script above.

2. Add these packages as dependencies for your Backstage app:

   ```sh title="From your Backstage root directory"
   yarn --cwd packages/backend add @backstage/plugin-permission-backend @backstage/plugin-permission-backend-module-allow-all-policy @internal/plugin-todo-list-backend @internal/plugin-todo-list-common
   yarn --cwd packages/app add @internal/plugin-todo-list
   ```

3. Include the backend and frontend plugin in your application:

   Apply the following changes to `packages/backend/src/index.ts`:

   ```ts title="packages/backend/src/index.ts"
   import { createBackend } from '@backstage/backend-defaults';
   //...
   const backend = createBackend();
   //...
   /* highlight-add-start */
   // Installing the permission plugin
   backend.add(import('@backstage/plugin-permission-backend'));
   // Installing the allow all permission policy module
   backend.add(
     import('@backstage/plugin-permission-backend-module-allow-all-policy'),
   );
   // Installing the todolist plugin
   backend.add(import('@internal/plugin-todo-list-backend'));
   /* highlight-add-end */
   //...
   backend.start();
   ```

   Apply the following changes to `packages/app/src/App.tsx`:

   ```tsx title="packages/app/src/App.tsx"
   /* highlight-add-next-line */
   import { TodoListPage } from '@internal/plugin-todo-list';
   //...

   const routes = (
     <FlatRoutes>
       {/* ... */}
       {/* highlight-add-next-line */}
       <Route path="/todo-list" element={<TodoListPage />} />
       {/* ... */}
     </FlatRoutes>
   );
   ```

Now if you start your application you should be able to reach the `/todo-list` page:

![Todo List plugin page](../../assets/permissions/permission-todo-list-page.png)

---

## Integrate the new plugin

If you play with the UI, you will notice that it is possible to perform a few actions:

- create a new todo item (`POST /todos`)
- view todo items (`GET /todos`)
- edit an existing todo item (`PUT /todos`)

Let's try to bring authorization on top of each one of them.
