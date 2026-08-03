---
id: catalog
sidebar_label: 001 - Catalog
title: Integrating with Catalog
description: How to integrate your plugin with the Backstage Software Catalog
---

## Software Catalog

### What is the Software Catalog?

The [Software Catalog](../../../features/software-catalog/index.md) is the
graph of typed entities that sits at the center of every Backstage instance. [Components, APIs, Resources, Systems, Users, Groups](../../../features/software-catalog/system-model.md) — anything an organization wants to model and reason about — live in the catalog and are related to each other through a set of [well-known relations](../../../features/software-catalog/well-known-relations.md).

Each entity is identified by its `kind`, `namespace` and `name` — together these form an [entity reference](../../../features/software-catalog/references.md) that other plugins use to point at it. The catalog backend ingests [entity descriptors](../../../features/software-catalog/descriptor-format.md) from one or more _sources_, validates them against a schema, runs them through a pipeline of [_processors_](../../../features/software-catalog/external-integrations.md#custom-processors), stitches the resulting relations together, and exposes the final state through a [queryable API](../../../features/software-catalog/api.md) that the frontend and other plugins consume.

For your plugin, the catalog is the place you go when you want a stable, shared answer to "which thing is this, who owns it, and how does it relate to everything else?" — rather than maintaining your own list of services, owners, or resources.

### Integration points

There are three main places where a plugin can plug into the catalog. Pick the one that matches the question you are trying to answer.

**[Entity providers](../../../features/software-catalog/external-integrations.md#custom-entity-providers)** push entities into the catalog. They run on a schedule, fetch data from an external system, and emit a full or delta set of entities that the catalog should know about. Use a provider when your plugin owns a source of truth that should appear in the catalog — todos discovered in a backing store, for example.

**[Catalog processors](../../../features/software-catalog/external-integrations.md#custom-processors)** transform entities as they flow through the ingestion pipeline. They can read [annotations](../../../features/software-catalog/descriptor-format.md#annotations-optional), mutate spec fields, emit additional entities, or attach extra relations. Use a processor when you want to react to existing entities or annotations rather than provide a brand-new source.

**The catalog model** controls which kinds, versions, and spec types are considered valid. [Extending the model](../../../features/software-catalog/extending-the-model.md) lets you introduce a new first-class kind — `Todo`, for example — with its own schema, relations, and type guards. Use a model extension when your data does not fit comfortably into any of the built-in kinds.

A typical plugin uses one or two of these together: a provider plus a model extension to introduce a new kind, or a processor that reads an annotation off existing entities to expose plugin-specific data.

## Showing todos for a catalog entity

The lightest-weight integration is to surface plugin data on entities that already live in the catalog. The source of truth for todos stays in your plugin's own store, and you join the two together by [entity reference](../../../features/software-catalog/references.md): each todo record carries the `kind:namespace/name` of the entity it belongs to, and the entity page asks the backend for "the todos that belong to me".

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

The catalog owns the component page. The todo backend owns the todo rows.
`forEntityRef` is the link that lets the todo backend answer "show me the todos
for this component" when a developer opens that component in the catalog.

You'll do this in three steps:

1. Associate todos with an entity ref.
2. Expose a route that returns the todos for a given entity ref.
3. Render the todos as a tab on the entity page.

By the end you should be able to open any component in the catalog, click a **Todos** tab, and see the todos that belong to it — or an empty state if there are none.

Install the catalog packages used by the snippets:

```shell
yarn workspace @internal/plugin-todo-backend add @backstage/catalog-model
yarn workspace @internal/plugin-todo add @backstage/catalog-model @backstage/plugin-catalog-react
```

### Step 1: Associate todos with an entity ref

Whenever your plugin records a todo, store the ref of the entity the todo belongs to alongside it. This is distinct from the existing `createdBy` field, which captures the _user_ who created the todo — `forEntityRef` captures the _thing the todo is about_ (a component, an API, a resource, and so on).

The ref is the stable identifier the catalog hands out — produced by [`stringifyEntityRef`](https://backstage.io/api/stable/functions/_backstage_catalog-model.index.stringifyEntityRef.html) and consumed by [`parseEntityRef`](https://backstage.io/api/stable/functions/_backstage_catalog-model.index.parseEntityRef.html) from `@backstage/catalog-model` — so it travels well between the backend, the catalog client, and the frontend.

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

Populate the field when a todo is created. The scaffolded backend already
accepts an `entityRef`; make it required for todos that should appear on
catalog entity pages, and normalize it before writing:

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

Keep the ref in lowercase, fully-qualified form (`kind:namespace/name`) so lookups are exact. If your plugin discovers todos from somewhere else — a tracker, a code scan, a checklist file — map each one onto the entity it concerns at ingest time, not at read time.

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

The entity page needs a single call that returns the todos for a given ref. Follow the same `:kind/:namespace/:name` shape the catalog itself uses for its routes — it keeps URLs predictable and avoids escaping the `:` in `kind:namespace/name`. The handler does three things:

1. Reads `kind`, `namespace`, and `name` from the URL.
2. Looks the entity up through the catalog service from `@backstage/plugin-catalog-node`, which routes through the [permissions framework](../../../permissions/overview.md) to confirm the caller is allowed to see it.
3. Asks your store for the todos that match the normalized ref.

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

Looking the entity up through the catalog before querying your own store does two things: it enforces the catalog's [permission model](../../../permissions/overview.md) (the caller can only see todos for entities they can see), and it normalizes the ref so that `component:petstore` and `Component:default/petstore` resolve to the same record. The catalog is the index here, not the database — it tells you _which_ entity the caller is asking about, and your plugin owns the data behind it.

**What you should see after this step:** with `yarn start` running, hit the route directly and you should get a JSON list back. For an entity that has todos:

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

For an entity that exists but has no todos you should get `{"items":[]}`, and for a ref that doesn't resolve you should get `404 Entity not found`. If you get a `403`, the calling identity doesn't have permission to read that entity — that's the catalog doing its job, not a bug in your route.

### Step 3: Render the todos on the entity page

On the frontend, pull the current entity out of context with [`useEntity`](https://backstage.io/api/stable/functions/_backstage_plugin-catalog-react.index.useEntity.html) from `@backstage/plugin-catalog-react`, stringify its ref, and call the new route. Wrap it in whatever your plugin uses for empty and error states:

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

With the component in place, register it as a tab on the entity page. The wiring depends on which frontend system the app uses:

- **New frontend system:** export an [`EntityContentBlueprint`](../../../frontend-system/building-plugins/03-common-extension-blueprints.md#entity-content) from `@backstage/plugin-catalog-react/alpha` and register it in your plugin module.
- **Legacy system:** add an `EntityLayout.Route` for `/todos` inside the app's `EntityPage`. See [catalog customization (legacy)](../../../features/software-catalog/catalog-customization--old.md) for the surrounding shape.

For the new frontend system, add the entity content extension to your plugin:

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

If the tab is missing entirely, the `EntityContentBlueprint`/`EntityLayout.Route` isn't being registered. If the tab is there but always empty, your todos probably aren't matching on `forEntityRef` — go back and check the values on the todo records against the ref the catalog page is using (you can read it from the URL).

### Going further

The join key above — an entity ref carried on each todo record — is all most plugins need. When you want adopters to do something on the catalog side to integrate with your plugin, lean on the catalog's existing extension surfaces rather than inventing your own:

- To attach plugin-specific configuration to an existing entity, use an [annotation](../../../features/software-catalog/descriptor-format.md#annotations-optional) on the entity's [`catalog-info.yaml`](../../../features/software-catalog/descriptor-format.md). See [well-known annotations](../../../features/software-catalog/well-known-annotations.md) for examples of how other plugins do this, and validate values during ingestion with a [custom processor](../../../features/software-catalog/external-integrations.md#custom-processors) if a bad value should fail the refresh rather than your plugin at runtime.
- To model todos (or any other concept) as first-class catalog citizens with their own kind, [relations](../../../features/software-catalog/well-known-relations.md), and spec, follow [Extending the model](../../../features/software-catalog/extending-the-model.md) to add a new entity kind, and use an [entity provider](../../../features/software-catalog/external-integrations.md#custom-entity-providers) to feed instances of that kind into the catalog.
- For background on how an entity moves from descriptor to queryable record (and where in that flow each of these extension points runs), read [Life of an entity](../../../features/software-catalog/life-of-an-entity.md).
