---
id: 05-frontend-authorization
title: 5. Frontend Components with Authorization
description: Placing frontend components behind authorization
---

In the previous sections, we learned how to protect our plugin's backend API routes with the permission framework. Most routes that return some data to be displayed (such as our `GET /todos` route) need no additional changes on the frontend, as the backend will simply return an empty list or a `404`. However, for UI elements that trigger a mutative action, it's common practice to hide or disable them when a user doesn't have permission.

Take, for example, the "Add" button in our todo list application. When a user clicks this button, the frontend makes a `POST` request to the `/todos` route of our backend. If a user tries to add a todo but is not authorized, they will have no way of knowing this until they perform the action and are faced with an error. This is a poor user experience. We can do better by disabling the add button.

:::note Note

Placing frontend components behind authorization cannot take the place of placing your backend routes behind authorization. Authorization checks on the frontend should be used in _addition_ to the corresponding backend authorization, as an improvement to the user experience. If you do not place your backend route behind authorization, a malicious actor can still send a request to the route even if you disabled the corresponding frontend component.

:::

## Using `usePermission`

Let's start by adding the packages we will need:

```bash
$ yarn workspace @internal/plugin-todo-list \
  add @backstage/plugin-permission-react @internal/plugin-todo-list-common
```

Let's make the following changes in `plugins/todo-list/src/components/TodoListPage/TodoListPage.tsx`:

```tsx title="plugins/todo-list/src/components/TodoListPage/TodoListPage.tsx"
import {
  alertApiRef,
  discoveryApiRef,
  fetchApiRef,
  useApi,
} from '@backstage/core-plugin-api';
/* highlight-add-start */
import { usePermission } from '@backstage/plugin-permission-react';
import { todoListCreatePermission } from '@internal/plugin-todo-list-common';
/* highlight-add-end */

function AddTodo({ onAdd }: { onAdd: (title: string) => any }) {
  const title = useRef('');
  /* highlight-add-next-line */
  const { loading: loadingPermission, allowed: canAddTodo } = usePermission({
    permission: todoListCreatePermission,
  });

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
        {/* highlight-remove-start */}
        <Button variant="contained" onClick={handleAdd}>
          Add
        </Button>
        {/* highlight-remove-end */}
        {/* highlight-add-start */}
        {!loadingPermission && (
          <Button
            disabled={!canAddTodo}
            variant="contained"
            onClick={() => onAdd(title.current)}
          >
            Add
          </Button>
        )}
        {/* highlight-add-end */}
      </Box>
    </>
  );
}
```

Here we are using the [`usePermission` hook](https://backstage.io/api/stable/functions/_backstage_plugin-permission-react.usePermission.html) to communicate with the permission policy and receive a decision on whether this user is authorized to create a todo list item.

It's really that simple! Let's change our policy to test the disabled button:

```ts title="packages/backend/src/plugins/permission.ts"
if (isPermission(request.permission, todoListCreatePermission)) {
  return {
    /* highlight-remove-next-line */
    result: AuthorizeResult.ALLOW,
    /* highlight-add-next-line */
    result: AuthorizeResult.DENY,
  };
}
```

And now you should see that you are not able to create a todo item from the frontend!

## Using `RequirePermission`

Providing a disabled state can be a helpful signal to users, but there may be cases where hiding the element is preferred. For such cases, you can use the provided [`RequirePermission` component](https://backstage.io/api/stable/functions/_backstage_plugin-permission-react.RequirePermission.html):

```tsx title="plugins/todo-list/src/components/TodoListPage/TodoListPage.tsx"
import {
  alertApiRef,
  discoveryApiRef,
  fetchApiRef,
  useApi,
} from '@backstage/core-plugin-api';
/* highlight-remove-next-line */
import { usePermission } from '@backstage/plugin-permission-react';
/* highlight-add-next-line */
import { RequirePermission } from '@backstage/plugin-permission-react';
import { todoListCreatePermission } from '@internal/plugin-todo-list-common';

export const TodoListPage = () => {
  // ..
  <Grid container spacing={3} direction="column">
    {/* highlight-remove-start */}
    <Grid item>
      <AddTodo onAdd={handleAdd} />
    </Grid>
    {/* highlight-remove-end */}
    {/* highlight-add-start */}
    <RequirePermission permission={todoListCreatePermission} errorPage={<></>}>
      <Grid item>
        <AddTodo onAdd={handleAdd} />
      </Grid>
    </RequirePermission>
    {/* highlight-add-end */}
    <Grid item>
      <TodoList key={key} onEdit={setEdit} />
    </Grid>
  </Grid>;
};

function AddTodo({ onAdd }: { onAdd: (title: string) => any }) {
  const title = useRef('');
  /* highlight-remove-next-line */
  const { loading: loadingPermission, allowed: canAddTodo } = usePermission({
    permission: todoListCreatePermission,
  });

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
        {/* highlight-remove-start */}
        {!loadingPermission && (
          <Button
            disabled={!canAddTodo}
            variant="contained"
            onClick={() => onAdd(title.current)}
          >
            Add
          </Button>
        )}
        {/* highlight-remove-end */}
        {/* highlight-add-start */}
        <Button variant="contained" onClick={() => onAdd(title.current)}>
          Add
        </Button>
        {/* highlight-add-end */}
      </Box>
    </>
  );
}
```

Now you should find that the component for adding a todo list item does not render at all. Success!

You can also use `RequirePermission` to prevent access to routes as well. Here's how that would look in your `packages/app/src/App.tsx`:

```tsx title="packages/app/src/App.tsx"
/* highlight-add-start */
import { RequirePermission } from '@backstage/plugin-permission-react';
import { todoListCreatePermission } from '@internal/plugin-todo-list-common';
/* highlight-add-end */

const routes = (
  <FlatRoutes>
    <Route path="/search" element={<SearchPage />}>
      {searchPage}
    </Route>
    <Route path="/settings" element={<UserSettingsPage />} />
    {/* highlight-add-next-line */}
    <Route path="/todo-list" element={
      {/* You might want to create a "read" permission for this, we are just using this one as an example */}
      {/* highlight-add-start */}
      <RequirePermission permission={todoListCreatePermission}>
        <TodoListPage />
      </RequirePermission>
      {/* highlight-add-end */}
    }>
      {/* ... */}
    </Route>
  </FlatRoutes>
);
```

Now if you try to navigate to `https://localhost:3000/todo-list` you'll get and error page if you do not have permission.
