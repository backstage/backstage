---
id: catalog
sidebar_label: 001 - Catalog
title: Integrating with Catalog
description: How to integrate your plugin with the Backstage Software Catalog
---

## Software Catalog

### What is the Software Catalog?

The [Software Catalog](../../../features/software-catalog/index.md) is
Backstage's directory of the software, teams, and people in an organization.
Each item in the Catalog is called an
[**entity**](../../../features/software-catalog/descriptor-format.md#overall-shape-of-an-entity).
For example, a service can be a
[Component entity](../../../features/software-catalog/system-model.md#component)
and a team can be a
[Group entity](../../../features/software-catalog/system-model.md#group).

Every entity has a unique address called an
[entity reference](../../../features/software-catalog/references.md). It
combines the entity's type, optional namespace, and name. For example,
`component:default/petstore` identifies the `petstore` Component.

The todo plugin will store this address on each TODO to record which Catalog
entity the TODO is about. The TODO remains in the todo plugin's database; the
Catalog only stores the Component.

## Showing todos for a catalog entity

Store the entity reference on each TODO in a field named `forEntityRef`. When a
user opens a Component page, the frontend asks the todo backend for TODOs whose
`forEntityRef` points to that Component.

### Prerequisites

Before starting this guide, you should have:

- A todo backend plugin with database persistence from [Persistence](../backend/003-persistence.md).
- A `plugins/todo-backend/src/router.ts` file that exposes the todo API.
- A `plugins/todo-backend/src/services/TodoListService.ts` file that owns todo reads and writes.
- A todo frontend plugin with a `TodoList` component and a `plugins/todo/src/plugin.tsx` file.
- At least one entity in the Software Catalog that you can open in the Backstage UI.

### Mental model

Think of this as tracking todos for software components.

In Backstage, a software component usually represents a codebase or service
that developers work on every day. For example, `component:default/petstore`
might be the service whose repository a team commits to. If your todo plugin
has a task like "Migrate to the new auth API", that task is more useful when
it appears on the `petstore` component page instead of living in a disconnected
todo list.

To make that connection, store the component's entity ref on the todo. Right
now, `TodoListService.ts` stores each todo with fields like `id`, `title`,
`createdBy`, and `createdAt`. This guide adds one more field: `forEntityRef`.
That field answers "which software component is this todo for?"

```text
todo row
  id: todo-1
  title: Migrate to the new auth API
  createdBy: user:default/alice
  forEntityRef: component:default/petstore
```

The Catalog is responsible for the Component and its page. The todo backend is
responsible for the TODO records. The `forEntityRef` field is simply the link
between them: the TODO points to the Component, but the Catalog does not need to
store or manage the TODO.

You'll do this in three steps:

1. Associate todos with an entity ref.
2. Expose a route that returns the todos for a given entity ref.
3. Render the todos as a tab on the entity page.

By the end, each Component page will have a **Todos** tab. The tab will show the Component's TODOs or an empty message when it has none.

Install the catalog packages used by the snippets:

```shell
yarn workspace @internal/plugin-todo-backend add @backstage/catalog-model
yarn workspace @internal/plugin-todo add @backstage/catalog-model @backstage/plugin-catalog-react
```

### Step 1: Associate todos with an entity ref

Whenever your plugin creates a TODO, store the entity reference alongside it.
The existing `createdBy` field answers "who created this TODO?"
`forEntityRef` answers "which Component is this TODO about?"

Use `stringifyEntityRef` from `@backstage/catalog-model` to turn a Catalog
entity into a consistently formatted reference. Use `parseEntityRef` when you
need to split that reference back into its `kind`, `namespace`, and `name`.

Add the field to the `TodoItem` interface introduced in [Persistence](../backend/003-persistence.md):

```diff title="plugins/todo-backend/src/services/TodoListService.ts"
 export interface TodoItem {
   title: string;
   id: string;
   createdBy: string;
+  forEntityRef: string; // e.g. 'component:default/petstore'
   createdAt: string;
 }
```

Add a matching column to the database and the row mapping so writes and reads stay in sync. A new migration is the cleanest place for the column:

```js title="plugins/todo-backend/migrations/<timestamp>_add_for_entity_ref.js"
exports.up = async knex => {
  await knex.schema.alterTable('todo', table => {
    table.string('for_entity_ref').notNullable().index();
  });
};

exports.down = async knex => {
  await knex.schema.alterTable('todo', table => {
    table.dropColumn('for_entity_ref');
  });
};
```

Update the row type and the mappers in `TodoListService` to carry the new field:

```diff title="plugins/todo-backend/src/services/TodoListService.ts"
 interface TodoDatabaseRow {
   title: string;
   id: string;
   created_by: string;
+  for_entity_ref: string;
   created_at: string;
 }

 private toDatabaseRow(todo: TodoItem): TodoDatabaseRow {
   return {
     id: todo.id,
     title: todo.title,
     created_by: todo.createdBy,
+    for_entity_ref: todo.forEntityRef,
     created_at: todo.createdAt,
   };
 }

 private fromDatabaseRow(row: TodoDatabaseRow): TodoItem {
   return {
     id: row.id,
     title: row.title,
     createdBy: row.created_by,
+    forEntityRef: row.for_entity_ref,
     createdAt: row.created_at,
   };
 }
```

When the backend creates a TODO, make `entityRef` required. Look up the entity
in the Catalog and use `stringifyEntityRef` before saving it. This ensures that
every TODO stores the reference in the same format:

```diff title="plugins/todo-backend/src/router.ts"
 const todoSchema = z.object({
   title: z.string(),
-  entityRef: z.string().optional(),
+  entityRef: z.string(),
 });
```

```diff title="plugins/todo-backend/src/services/TodoListService.ts"
+import { stringifyEntityRef } from '@backstage/catalog-model';

   async createTodo(
     input: {
       title: string;
-      entityRef?: string;
+      entityRef: string;
     },
     options: {
       credentials: BackstageCredentials<BackstageUserPrincipal>;
     },
   ): Promise<TodoItem> {
     let title = input.title;
+    let forEntityRef = input.entityRef;

     if (input.entityRef) {
       const entity = await this.#catalog.getEntityByRef(
         input.entityRef,
@@
       const entityDisplay = entity.metadata.title ?? input.entityRef;
       title = `[${entityDisplay}] ${input.title}`;
+      forEntityRef = stringifyEntityRef(entity);
     }

     const id = crypto.randomUUID();
@@
       title,
       id,
       createdBy,
+      forEntityRef,
       createdAt: new Date().toISOString(),
     };
```

Add a lookup method that returns the todos for a single entity:

```ts title="plugins/todo-backend/src/services/TodoListService.ts"
async listTodosForEntity(request: {
  forEntityRef: string;
}): Promise<{ items: TodoItem[] }> {
  const rows = await this.#database('todo')
    .where({ for_entity_ref: request.forEntityRef })
    .select();

  return { items: rows.map(row => this.fromDatabaseRow(row)) };
}
```

Keep every reference in the same lowercase `kind:namespace/name` format so that exact database matches work. If TODOs also come from a tracker, code scan, or checklist file, add the Component reference when each TODO is first saved.

**What you should see after this step:** every todo your plugin creates or returns now carries a `forEntityRef`. If you `console.log` a todo, or query your store directly, the record should look like:

```json
{
  "id": "todo-1",
  "title": "Migrate to the new auth API",
  "createdBy": "user:default/alice",
  "forEntityRef": "component:default/petstore",
  "createdAt": "2026-05-27T12:00:00.000Z"
}
```

If `forEntityRef` is missing, `undefined`, or capitalized differently per row, fix that here before moving on — the next step relies on exact matches.

### Step 2: Expose a "todos for this entity" route

The Component page needs one backend call that returns its TODOs. Put the
entity's `kind`, `namespace`, and `name` in separate parts of the URL. The
route:

1. Reads those three values from the URL.
2. Confirms that the Component exists in the Catalog.
3. Formats its entity reference consistently.
4. Returns TODOs whose `forEntityRef` matches it.

First add the catalog service to your plugin setup:

```diff title="plugins/todo-backend/src/plugin.ts"
+import { catalogServiceRef } from '@backstage/plugin-catalog-node';

 // ...

       deps: {
         httpAuth: coreServices.httpAuth,
         httpRouter: coreServices.httpRouter,
+        catalog: catalogServiceRef,
         todoList: todoListServiceRef,
       },
-      async init({ httpAuth, httpRouter, todoList }) {
+      async init({ httpAuth, httpRouter, catalog, todoList }) {
         httpRouter.use(
           await createRouter({
             httpAuth,
+            catalog,
             todoList,
           }),
         );
```

```ts
// plugins/todo-backend/src/router.ts
/* highlight-add-start */
import { catalogServiceRef } from '@backstage/plugin-catalog-node';
import { stringifyEntityRef } from '@backstage/catalog-model';
/* highlight-add-end */

export async function createRouter({
  httpAuth,
  catalog,
  todoList,
}: {
  httpAuth: HttpAuthService;
  /* highlight-add-start */
  catalog: typeof catalogServiceRef.T;
  /* highlight-add-end */
  todoList: typeof todoListServiceRef.T;
}): Promise<express.Router> {
  const router = Router();
  router.use(express.json());

  /* highlight-add-start */
  router.get('/todos/by-entity/:kind/:namespace/:name', async (req, res) => {
    const credentials = await httpAuth.credentials(req);
    const { kind, namespace, name } = req.params;

    const entity = await catalog.getEntityByRef(
      { kind, namespace, name },
      { credentials },
    );
    if (!entity) {
      res.status(404).json({ error: 'Entity not found' });
      return;
    }

    const result = await todoList.listTodosForEntity({
      forEntityRef: stringifyEntityRef(entity),
    });
    res.json(result);
  });
  /* highlight-add-end */
}
```

The Catalog lookup confirms that the Component exists. It also turns shortened
or differently capitalized input into one consistent reference, such as
`component:default/petstore`. The Catalog still stores only the Component; the
todo database stores the matching TODOs.

**What you should see after this step:** with `yarn start` running, call the new
route. The command below signs in as the local guest user, gets a Backstage
token, and uses that token to request the TODOs:

```shell
curl http://localhost:7007/api/todo/todos/by-entity/component/default/petstore \
  -H "Authorization: Bearer $(curl -s http://localhost:7007/api/auth/guest/refresh | jq -r '.backstageIdentity.token')"
```

The output is similar to this:

```json
{
  "items": [
    {
      "id": "todo-1",
      "title": "Migrate to the new auth API",
      "createdBy": "user:default/alice",
      "forEntityRef": "component:default/petstore",
      "createdAt": "2026-05-27T12:00:00.000Z"
    }
  ]
}
```

For a Component with no TODOs, the response is `{"items":[]}`. For a Component that does not exist, the response is `404 Entity not found`. A `403` response means the signed-in user may not read that Component.

### Step 3: Render the todos on the entity page

On the frontend, `useEntity` provides the Component page the user is viewing. Format that Component's reference and call the new todo route. The component below shows progress while loading, an error if the request fails, an empty message when there are no TODOs, or the TODO list:

```tsx
// plugins/todo/src/components/EntityTodoContent.tsx
import {
  EmptyState,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { parseEntityRef, stringifyEntityRef } from '@backstage/catalog-model';
import { fetchApiRef, useApi } from '@backstage/frontend-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import useAsync from 'react-use/esm/useAsync';
import { TodoList, type TodoItem } from './TodoList';

export const EntityTodoContent = () => {
  const { entity } = useEntity();
  const { fetch } = useApi(fetchApiRef);

  const entityRef = stringifyEntityRef(entity);
  const {
    value: todos,
    loading,
    error,
  } = useAsync(async (): Promise<TodoItem[]> => {
    const { kind, namespace, name } = parseEntityRef(entityRef);
    const response = await fetch(
      `plugin://todo/todos/by-entity/${encodeURIComponent(
        kind,
      )}/${encodeURIComponent(namespace)}/${encodeURIComponent(name)}`,
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch todos: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data.items;
  }, [entityRef, fetch]);

  if (loading) return <Progress />;
  if (error) return <ResponseErrorPanel error={error} />;
  if (!todos?.length) {
    return <EmptyState missing="data" title="No todos for this entity" />;
  }

  return <TodoList todos={todos} />;
};
```

With the component in place, export an
[`EntityContentBlueprint`](../../../frontend-system/building-plugins/03-common-extension-blueprints.md)
and register it in your plugin:

```diff title="plugins/todo/src/plugin.tsx"
+import { EntityContentBlueprint } from '@backstage/plugin-catalog-react/alpha';

 // ...

+export const todoEntityContent = EntityContentBlueprint.make({
+  params: {
+    path: 'todos',
+    title: 'Todos',
+    loader: () =>
+      import('./components/EntityTodoContent').then(m => (
+        <m.EntityTodoContent />
+      )),
+  },
+});
+
 export const todoPlugin = createFrontendPlugin({
   pluginId: 'todo',
-  extensions: [page],
+  extensions: [page, todoEntityContent],
  routes: {
    root: rootRouteRef,
  },
});
```

**What you should see after this step:** start the example app with `yarn start`, open any component in the catalog (for example `/catalog/default/component/petstore`), and a **Todos** tab should appear in the entity header.

- On an entity that has todos, the tab shows the list.
- On an entity that has none, it shows "No todos for this entity" rather than an error or a blank page.
- Switching to another entity should load the todos for that entity.

If the tab is missing, confirm that `todoEntityContent` is included in the plugin's `extensions` array. If the tab is present but empty, compare `forEntityRef` on the TODO records with the Component reference shown in the Catalog URL.

### Further reading

This guide keeps TODOs in the todo plugin and stores only the Catalog entity
reference on each TODO. Some plugins need deeper Catalog customization. Read
the following specialized guides when you need them:

- [Annotations](../../../features/software-catalog/descriptor-format.md#annotations-optional)
  add plugin-specific information to an existing Catalog entity.
- [Custom processors](../../../features/software-catalog/external-integrations.md#custom-processors)
  check or change entity data as the Catalog reads it.
- [Extending the model](../../../features/software-catalog/extending-the-model.md)
  adds a new kind of Catalog entity.
