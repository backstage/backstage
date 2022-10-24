---
id: 05-frontend-authorization
title: 5. Frontend Components with Authorization
description: Placing frontend components behind authorization
---

In the previous sections, we learned how to protect our plugin's backend API routes with the permission framework. Most routes that return some data to be displayed (such as our `GET /todos` route) need no additional changes on the frontend, as the backend will simply return an empty list or a `404`. However, for UI elements that trigger a mutative action, it's common practice to hide or disable them when a user doesn't have permission.

Take, for example, the "Add" button in our todo list application. When a user clicks this button, the frontend makes a `POST` request to the `/todos` route of our backend. If a user tries to add a todo but is not authorized, they will have no way of knowing this until they perform the action and are faced with an error. This is a poor user experience. We can do better by disabling the add button.

> Note: Placing frontend components behind authorization cannot take the place of placing your backend routes behind authorization. Authorization checks on the frontend should be used in _addition_ to the corresponding backend authorization, as an improvement to the user experience. If you do not place your backend route behind authorization, a malicious actor can still send a request to the route even if you disabled the corresponding frontend component.

## Using `usePermission`

Let's start by adding the packages we will need:

```
$ yarn workspace @internal/plugin-todo-list \
  add @backstage/plugin-permission-react @internal/plugin-todo-list-common
```

Let's make the following changes in `plugins/todo-list/src/components/TodoListPage/TodoListPage.tsx`:

```diff
...

  import {
    alertApiRef,
    discoveryApiRef,
    fetchApiRef,
    useApi,
  } from '@backstage/core-plugin-api';
+ import { usePermission } from '@backstage/plugin-permission-react';
+ import { todoListCreatePermission } from '@internal/plugin-todo-list-common';

...

  function AddTodo({ onAdd }: { onAdd: (title: string) => any }) {
    const title = useRef('');
+   const { loading: loadingPermission, allowed: canAddTodo } = usePermission({ permission: todoListCreatePermission });

    return (
      <>
        <Typography variant="body1">Add todo</Typography>
        <Box
          component="span"
          alignItems="flex-end"
          display="flex"
          flexDirection="row"
        >
          <TextField
            placeholder="Write something here..."
            onChange={e => (title.current = e.target.value)}
          />
-         <Button variant="contained" onClick={handleAdd}>
-           Add
-         </Button>
+         {!loadingPermission && (
+           <Button disabled={!canAddTodo} variant="contained" onClick={handleAdd}>
+             Add
+           </Button>
+         )}
        </Box>
      </>
    );
  }

...
```

Here we are using the [`usePermission` hook](https://backstage.io/docs/reference/plugin-permission-react.usepermission) to communicate with the permission policy and receive a decision on whether this user is authorized to create a todo list item.

It's really that simple! Let's change our policy to test the disabled button:

```diff
// packages/backend/src/plugins/permission.ts

...

    if (isPermission(request.permission, todoListCreatePermission)) {
      return {
-       result: AuthorizeResult.ALLOW,
+       result: AuthorizeResult.DENY,
      };
    }

...
```

And now you should see that you are not able to create a todo item from the frontend!

## Using `RequirePermission`

Providing a disabled state can be a helpful signal to users, but there may be cases where hiding the element is preferred. For such cases, you can use the provided [`RequirePermission` component](https://backstage.io/docs/reference/plugin-permission-react.requirepermission):

```diff
// plugins/todo-list/src/components/TodoListPage/TodoListPage.tsx

...

  import {
    alertApiRef,
    discoveryApiRef,
    fetchApiRef,
    useApi,
  } from '@backstage/core-plugin-api';
- import { usePermission } from '@backstage/plugin-permission-react';
+ import { RequirePermission } from '@backstage/plugin-permission-react';
  import { todoListCreatePermission } from '@internal/plugin-todo-list-common';

...

  export const TodoListPage = () => {

...

          <Grid container spacing={3} direction="column">
-           <Grid item>
-             <AddTodo onAdd={handleAdd} />
-           </Grid>
+           <RequirePermission permission={todoListCreatePermission} errorPage={<></>}>
+             <Grid item>
+               <AddTodo onAdd={handleAdd} />
+             </Grid>
+           </RequirePermission>
            <Grid item>
              <TodoList key={key} onEdit={setEdit} />
            </Grid>
          </Grid>

...


  function AddTodo({ onAdd }: { onAdd: (title: string) => any }) {
    const title = useRef('');
-   const { loading: loadingPermission, allowed: canAddTodo } = usePermission({ permission: todoListCreatePermission });

    return (
      <>
        <Typography variant="body1">Add todo</Typography>
        <Box
          component="span"
          alignItems="flex-end"
          display="flex"
          flexDirection="row"
        >
          <TextField
            placeholder="Write something here..."
            onChange={e => (title.current = e.target.value)}
          />
-         {!loadingPermission && (
-           <Button disabled={!canAddTodo} variant="contained" onClick={handleAdd}>
-             Add
-           </Button>
-         )}
+         <Button variant="contained" onClick={handleAdd}>
+           Add
+         </Button>
        </Box>
      </>
    );
  }

...
```

Now you should find that the component for adding a todo list item does not render at all. Success!

You can also use `RequirePermission` to prevent access to routes as well. Here's how that would look in your `packages/app/src/App.tsx`:

```diff
+ import { RequirePermission } from '@backstage/plugin-permission-react';
+ import { todoListCreatePermission } from '@internal/plugin-todo-list-common';

...

    <Route path="/search" element={<SearchPage />}>
      {searchPage}
    </Route>
    <Route path="/settings" element={<UserSettingsPage />} />
+   <Route path="/todo-list" element={
       // You might want to create a "read" permission for this, we are just using this one as an example
+      <RequirePermission permission={todoListCreatePermission}>
+        <TodoListPage />
+      </RequirePermission>
  </FlatRoutes>
```

Now if you try to navigate to `https://localhost:3000/todo-list` you'll get and error page if you do not have permission.
