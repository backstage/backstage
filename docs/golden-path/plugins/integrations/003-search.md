---
id: search
sidebar_label: 003 - Search
title: Integrating with Search
description: Make plugin data searchable without showing private results
---

## Search

### What is Backstage Search?

[Backstage Search](../../../features/search/README.md) gives users one search
box for information from many Backstage plugins. Each searchable item is called
a [**document**](../../../features/search/concepts.md#documents-and-indices). In
this guide, every TODO becomes one document.

Search stores documents in a
[search index](../../../features/search/concepts.md#documents-and-indices),
which is similar to a database built for fast text searches. A
[**collator**](../../../features/search/concepts.md#collators) is a small
backend process that copies data from a plugin into that index. A
[frontend result component](../../../features/search/how-to-guides.md#how-to-render-search-results-using-extensions)
controls how each match looks in the search results.

This guide adds the following path:

```text
TODOs in the todo backend
  -> TODO collator copies them into Search
  -> user searches
  -> todo.read removes results the user may not see
```

Search does not ask the todo backend for every search. The collator copies all
TODOs into the index ahead of time. Before Search shows a match, it uses the
`todo.read` permission from [Permissions](002-permissions.md) to check that the
signed-in user may read that TODO.

## Indexing TODOs

### Prerequisites

Before starting:

- Complete [Permissions](002-permissions.md).
- Install the Search backend and frontend in the example app.
- Have at least one owner-visible TODO with a distinctive title.

You will:

1. Describe what a TODO looks like inside Search.
2. Add a backend route that gives TODOs to the Search collator.
3. Create and register the collator.
4. Tell Search to apply `todo.read` to each TODO result.
5. Choose how TODO matches appear in the search results.
6. Test Search as an owner and a non-owner.

Create a shared package if the todo plugin does not already have one, then
create a Search backend module:

```shell
yarn new --select backend-plugin-module --option pluginId=search
```

Name the module `todo` when prompted. Install the required packages:

```shell
yarn workspace @internal/plugin-todo-common add @backstage/plugin-search-common
yarn workspace @internal/plugin-search-backend-module-todo add @backstage/catalog-model @backstage/plugin-search-backend-node @backstage/plugin-search-common @internal/plugin-todo-common
yarn workspace @internal/plugin-todo add @backstage/plugin-search-react @internal/plugin-todo-common
```

### Step 1: Define the document type

A collator emits `IndexableDocument` objects. Add the TODO-specific fields that
Search and the result component need:

```ts title="plugins/todo-common/src/TodoSearchDocument.ts"
import type { IndexableDocument } from '@backstage/plugin-search-common';

export interface TodoSearchDocument extends IndexableDocument {
  id: string;
  forEntityRef: string;
  createdAt: string;
}

export const TODO_SEARCH_TYPE = 'todo';
```

Export the type and constant from `plugins/todo-common/src/index.ts`. The
backend and frontend will both import them so that they agree on the name and
shape of a TODO search document.

### Step 2: Expose TODOs for indexing

The collator needs a way to read every TODO before copying them into Search.
The request comes from the Search backend rather than a signed-in user, so
allow only requests made by another Backstage backend plugin:

```ts title="plugins/todo-backend/src/router.ts"
router.get('/todos/index', async (req, res) => {
  await httpAuth.credentials(req, { allow: ['service'] });
  res.json(await todoList.listTodos());
});
```

Do not use this route in the frontend. It returns all TODOs to Search, including
private ones. Search applies `todo.read` before it returns matches to a user.

### Step 3: Build the collator

```ts title="plugins/search-backend-module-todo/src/TodoCollatorFactory.ts"
import { Readable } from 'node:stream';
import type {
  AuthService,
  DiscoveryService,
} from '@backstage/backend-plugin-api';
import { parseEntityRef } from '@backstage/catalog-model';
import type { DocumentCollatorFactory } from '@backstage/plugin-search-common';
import {
  TODO_SEARCH_TYPE,
  type TodoSearchDocument,
} from '@internal/plugin-todo-common';

type TodoListResponse = {
  items: {
    id: string;
    title: string;
    forEntityRef: string;
    createdAt: string;
  }[];
};

export class TodoCollatorFactory implements DocumentCollatorFactory {
  readonly type = TODO_SEARCH_TYPE;

  constructor(
    private readonly options: {
      auth: AuthService;
      discovery: DiscoveryService;
    },
  ) {}

  async getCollator(): Promise<Readable> {
    return Readable.from(this.execute());
  }

  private async *execute(): AsyncGenerator<TodoSearchDocument> {
    const { items } = await this.listTodos();

    for (const todo of items) {
      const { kind, namespace, name } = parseEntityRef(todo.forEntityRef);
      yield {
        id: todo.id,
        title: todo.title,
        text: `TODO for ${todo.forEntityRef}`,
        location: `/catalog/${namespace}/${kind}/${name}/todos`,
        forEntityRef: todo.forEntityRef,
        createdAt: todo.createdAt,
      };
    }
  }

  private async listTodos(): Promise<TodoListResponse> {
    const baseUrl = await this.options.discovery.getBaseUrl('todo');
    const { token } = await this.options.auth.getPluginRequestToken({
      onBehalfOf: await this.options.auth.getOwnServiceCredentials(),
      targetPluginId: 'todo',
    });
    const response = await fetch(`${baseUrl}/todos/index`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch TODOs: ${response.status} ${response.statusText}`,
      );
    }
    return response.json();
  }
}
```

The result location opens the referenced entity's **Todos** tab, which was
added in the Catalog chapter.

### Step 4: Register the collator and its permission

Connect the `todo.read` permission to the documents produced by the collator.
This tells Search which permission it must check before showing a TODO result:

```diff title="plugins/search-backend-module-todo/src/TodoCollatorFactory.ts"
+import { todoReadPermission } from '@internal/plugin-todo-common';

 export class TodoCollatorFactory implements DocumentCollatorFactory {
   readonly type = TODO_SEARCH_TYPE;
+  readonly visibilityPermission = todoReadPermission;

   // ...

       yield {
         id: todo.id,
         title: todo.title,
         text: `TODO for ${todo.forEntityRef}`,
         location: `/catalog/${namespace}/${kind}/${name}/todos`,
         forEntityRef: todo.forEntityRef,
         createdAt: todo.createdAt,
+        authorization: { resourceRef: todo.id },
       };
```

Register the collator with Search and choose how often it runs:

```ts title="plugins/search-backend-module-todo/src/module.ts"
import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { searchIndexRegistryExtensionPoint } from '@backstage/plugin-search-backend-node/alpha';
import { TodoCollatorFactory } from './TodoCollatorFactory';

export const searchModuleTodo = createBackendModule({
  pluginId: 'search',
  moduleId: 'todo',
  register(env) {
    env.registerInit({
      deps: {
        auth: coreServices.auth,
        discovery: coreServices.discovery,
        scheduler: coreServices.scheduler,
        indexRegistry: searchIndexRegistryExtensionPoint,
      },
      async init({ auth, discovery, scheduler, indexRegistry }) {
        indexRegistry.addCollator({
          schedule: scheduler.createScheduledTaskRunner({
            frequency: { minutes: 10 },
            timeout: { minutes: 5 },
            initialDelay: { seconds: 30 },
          }),
          factory: new TodoCollatorFactory({ auth, discovery }),
        });
      },
    });
  },
});
```

Install the module in `packages/backend/src/index.ts`:

```ts
backend.add(import('@internal/plugin-search-backend-module-todo'));
```

### Step 5: Render TODO results

Create the component that displays a TODO in the search results:

```tsx title="plugins/todo/src/components/TodoSearchResultListItem.tsx"
import { Link } from '@backstage/core-components';
import type { BaseSearchResultListItemProps } from '@backstage/plugin-search-react/alpha';
import type { TodoSearchDocument } from '@internal/plugin-todo-common';

export function TodoSearchResultListItem({
  result,
}: BaseSearchResultListItemProps) {
  const todo = result as TodoSearchDocument | undefined;
  if (!todo) {
    return null;
  }

  return (
    <div>
      <Link to={todo.location}>{todo.title}</Link>
      <div>{todo.forEntityRef}</div>
    </div>
  );
}
```

Register it in the TODO frontend plugin:

```ts title="plugins/todo/src/plugin.tsx"
import { SearchResultListItemBlueprint } from '@backstage/plugin-search-react/alpha';
import { TODO_SEARCH_TYPE } from '@internal/plugin-todo-common';

export const todoSearchResultListItem = SearchResultListItemBlueprint.make({
  params: {
    predicate: result => result.type === TODO_SEARCH_TYPE,
    component: () =>
      import('./components/TodoSearchResultListItem').then(
        m => m.TodoSearchResultListItem,
      ),
  },
});

export const todoPlugin = createFrontendPlugin({
  pluginId: 'todo',
  extensions: [page, todoEntityContent, todoSearchResultListItem],
  routes: { root: rootRouteRef },
});
```

### Step 6: Verify Search

1. Start Backstage and create a TODO with a distinctive title for a component
   owned by your test Group.
2. Wait for the first collator run. With the schedule above, it starts after
   approximately 30 seconds.
3. Sign in as a Group member and search for the distinctive title.
4. Confirm the TODO result appears and opens the component's **Todos** tab.
5. Sign in as a non-owner and repeat the search.
6. Confirm the protected TODO does not appear.

If neither user sees the result, check the Search backend logs for errors from
the TODO collator. If both users see it, check that the collator uses
`todoReadPermission` and sets `authorization.resourceRef` to the TODO id. Those
two values connect each search document to the permission created in the
Permissions chapter.

## Further reading

For production scaling, pagination, decorator pipelines, engine selection, and
schedule tuning, see [Search concepts](../../../features/search/concepts.md),
[collators](../../../features/search/collators.md), and
[search engines](../../../features/search/search-engines.md).
