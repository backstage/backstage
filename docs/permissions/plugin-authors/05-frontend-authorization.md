---
id: 05-frontend-authorization
title: 5. Frontend Components with Authorization
description: Placing frontend components behind authorization
---

In the previous sections, we learned how to place our plugin's backend API routes behind authorization using the permission framework. Most routes that return some data to be displayed (such as our `GET /todos` route) need no additional changes on the frontend, as the backend will simply not return the items that are unauthorized for the user. However, UI elements that allow the user to trigger some sort of creation, edit, or removal through an interaction often need additional changes to provide a good user experience.

Take, for example, the "Add" button in our todo list application. When a user clicks this button, the frontend makes a `POST` request to our backend's `/todos` route. If a user tries to add a todo but is not authorized, they will have no way of knowing this until they perform the action and are faced with an error. This is a poor user experience. We can do better by disabling the add button.

**NOTE:** Placing frontend components behind authorization cannot take the place of placing your backend routes behind authorization. Authorization checks on the frontend should be used in _addition_ to the corresponding backend authorization, as an improvement to the user experience. If you do not place your backend route behind authorization, a malicious actor can still send a request to the route even if you disabled the corresponding frontend component.

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
+ import { todoListCreate } from '@internal/plugin-todo-list-common';
...

  export const TodoListPage = () => {
    const discoveryApi = useApi(discoveryApiRef);
    const { fetch } = useApi(fetchApiRef);
    const alertApi = useApi(alertApiRef);
    const title = useRef('');
    const [key, refetchTodos] = useReducer(i => i + 1, 0);
    const [editElement, setEdit] = useState<Todo | undefined>();

+   const { loading: loadingPermission, allowed: canAddTodo } = usePermission({ permission: todoListCreate });
...

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
-             <Button variant="contained" onClick={handleAdd}>
-               Add
-             </Button>
+             {!loadingPermission && (
+               <Button disabled={!canAddTodo} variant="contained" onClick={handleAdd}>
+                 Add
+               </Button>
+             )}
            </Box>
...
```

Here we are using the [`usePermission` hook](https://backstage.io/docs/reference/plugin-permission-react.usepermission) to easily communicate with the permission policy and receive a decision on whether this user is authorized to create a todo list item.

It's really that simple! Let's change our policy to test the disabled button:

```diff
// packages/backend/src/plugins/permission.ts

...

    if (isPermission(request.permission, todoListCreate)) {
      return {
-       result: AuthorizeResult.ALLOW,
+       result: AuthorizeResult.DENY,
      };
    }

...
```

And now you should see that you are not able to create a todo item from the frontend!

## Using `RequirePermission`

More realistically, you probably don't even want to show the entire part of the UI that is used for todo list item creation if the user can't create a todo list item. For such cases, you can use the provided [`RequirePermission` component](https://backstage.io/docs/reference/plugin-permission-react.requirepermission):

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
  import { todoListCreate } from '@internal/plugin-todo-list-common';
...

  export const TodoListPage = () => {
    const discoveryApi = useApi(discoveryApiRef);
    const { fetch } = useApi(fetchApiRef);
    const alertApi = useApi(alertApiRef);
    const title = useRef('');
    const [key, refetchTodos] = useReducer(i => i + 1, 0);
    const [editElement, setEdit] = useState<Todo | undefined>();

-   const { loading: loadingPermission, allowed: canAddTodo } = usePermission({ permission: todoListCreate });
...

        <Grid container spacing={3} direction="column">
-         <Grid item>
-           <Typography variant="body1">Add todo</Typography>
-           <Box
-             component="span"
-             alignItems="flex-end"
-             display="flex"
-             flexDirection="row"
-           >
-             <TextField
-               placeholder="Write something here..."
-               onChange={e => (title.current = e.target.value)}
-             />
-             {!loadingPermission && (
-               <Button disabled={!canAddTodo} variant="contained" onClick={handleAdd}>
-                 Add
-               </Button>
-             )}
-           </Box>
-         </Grid>
+         <RequirePermission permission={todoListCreate}>
+           <Grid item>
+             <Typography variant="body1">Add todo</Typography>
+             <Box
+               component="span"
+               alignItems="flex-end"
+               display="flex"
+               flexDirection="row"
+             >
+               <TextField
+                 placeholder="Write something here..."
+                 onChange={e => (title.current = e.target.value)}
+               />
+               <Button variant="contained" onClick={handleAdd}>
+                 Add
+               </Button>
+             </Box>
+           </Grid>
+           <Grid item>
+             <TodoList key={key} onEdit={setEdit} />
+           </Grid>
+         </RequirePermission>
        </Grid>

...
```

Now you should find that the component for adding a todo list item does not render at all. Success!
