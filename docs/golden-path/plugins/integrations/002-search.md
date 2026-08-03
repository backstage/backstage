---
id: search
sidebar_label: 002 - Search
title: Integrating with Search
description: How to integrate your plugin with Backstage Search
---

## Search

### What is Backstage Search?

[Backstage Search](../../../features/search/README.md) is the federated search
layer that sits in front of every other plugin. It periodically indexes
documents from contributing plugins into a single search engine, exposes a
unified query API, and renders the results behind one search box on the
frontend. Adopters get a consistent search experience without each plugin
having to ship its own.

The pieces fit together like this:

- **Collators** read documents out of a source (the catalog, TechDocs, your
  plugin's database) and stream them into the index on a schedule.
- **Decorators** sit between collators and the engine, transforming or
  filtering documents on the way through — adding fields, dropping
  unauthorized entries, etc.
- A **search engine** (Lunr in-process by default, Postgres or Elasticsearch
  in production) stores the index and answers queries.
- The **frontend** issues queries through the search API and renders matches
  using per-document-type **result item components**.

For your plugin, this means search work splits cleanly into two questions:
"how do I get my data into the index?" (a backend collator), and "how should
matches look in the results list?" (a frontend extension).

### Common integration points

Most plugins need one or both of the following:

**A collator on the backend** that turns your domain objects into
`IndexableDocument`s and emits them on a schedule. Use a collator when you own
data that other Backstage users would benefit from searching across.

**A result item component on the frontend** that renders matches for your
document type in the global search modal and on the search page. Use this
when the default rendering does not carry enough information for users to
recognize a match.

A small number of plugins also ship a **decorator** — for example, to attach
ownership data to documents from another collator — but a collator plus a
result item is the common case.

## Creating a custom TODO collator

The goal is to make every todo in your plugin's store appear in global
search, scored alongside catalog entities and TechDocs pages.

### Prerequisites

Before starting this guide, you should have:

- A todo backend plugin that can return todos from `GET /todos`.
- A todo frontend plugin with a `plugins/todo/src/plugin.tsx` file.
- A shared `@internal/plugin-todo-common` package, or a plan to create one for
  types and constants shared between backend and frontend packages.
- A search backend in your app, with a place to install a new search backend
  module.
- A `plugins/search-backend-module-todo` backend module package, or an
  equivalent package where you can put the todo collator.

### Mental model

Search keeps its own index. It does not query every plugin in real time when a
user types into the search box. Instead, a backend collator periodically reads
todo data, turns each todo into a small search document, and sends those
documents to the search backend.

The frontend result item is separate from indexing. It does not decide what is
searchable. It only tells the Search UI how to render a result whose type is
`todo`.

The examples use a shared `@internal/plugin-todo-common` package for values
that are needed by both backend and frontend code. If you have not created that
package yet, create it before copying the snippets below, and add it as a
dependency of the todo frontend, todo backend, and search backend module
packages.

You'll do this in five steps:

1. Define the document type.
2. Build the collator factory.
3. Register the collator with the search backend.
4. Respect permissions during indexing.
5. Render todo results on the frontend.

Install the search packages used by the snippets:

```shell
yarn workspace @internal/plugin-todo-common add @backstage/plugin-search-common
yarn workspace @internal/plugin-search-backend-module-todo add @backstage/plugin-search-backend-node @backstage/plugin-search-common @internal/plugin-todo-common
yarn workspace @internal/plugin-todo add @backstage/plugin-search-react @internal/plugin-todo-common
```

### Step 1: Define the document type

A collator emits documents that implement `IndexableDocument`. The base type
already includes `title`, `text`, and `location`; extend it with the fields
you want to search on or display:

```ts
// plugins/todo-common/src/TodoSearchDocument.ts
import type { IndexableDocument } from '@backstage/plugin-search-common';

export interface TodoSearchDocument extends IndexableDocument {
  createdBy: string;
  createdAt: string;
}

export const TODO_SEARCH_TYPE = 'todo';
```

Export the document type and the `TODO_SEARCH_TYPE` string from your common
package. The frontend will key its result item off the same string, so
sharing it through `todo-common` prevents drift.

```ts title="plugins/todo-common/src/index.ts"
export * from './TodoSearchDocument';
```

### Step 2: Build the collator factory

Implement `DocumentCollatorFactory`. The `type` field is the document type
the engine indexes against; `getCollator` returns a `Readable` stream of your
documents:

```ts
// plugins/search-backend-module-todo/src/TodoCollatorFactory.ts
import { Readable } from 'node:stream';
import type {
  AuthService,
  DiscoveryService,
} from '@backstage/backend-plugin-api';
import type { DocumentCollatorFactory } from '@backstage/plugin-search-common';
import {
  TODO_SEARCH_TYPE,
  type TodoSearchDocument,
} from '@internal/plugin-todo-common';

type TodoListResponse = {
  items: {
    title: string;
    id: string;
    createdBy: string;
    createdAt: string;
  }[];
};

export class TodoCollatorFactory implements DocumentCollatorFactory {
  public readonly type = TODO_SEARCH_TYPE;

  constructor(
    private readonly options: {
      auth: AuthService;
      discovery: DiscoveryService;
      locationTemplate?: string;
    },
  ) {}

  async getCollator(): Promise<Readable> {
    return Readable.from(this.execute());
  }

  private async *execute(): AsyncGenerator<TodoSearchDocument> {
    const { items } = await this.listTodos();

    for (const todo of items) {
      yield {
        title: todo.title,
        text: `Created by ${todo.createdBy}`,
        location: (this.options.locationTemplate ?? '/todo/:id').replace(
          ':id',
          encodeURIComponent(todo.id),
        ),
        createdBy: todo.createdBy,
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

    const response = await fetch(`${baseUrl}/todos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch todos: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }
}
```

The `location` field is what users click on in the result list, so make sure
it routes to the page on your frontend that actually shows the todo. If your
store grows large, replace the single `listTodos` call with a paginated method
and keep yielding documents from the async generator.

If your `GET /todos` route only accepts user credentials after adding
permissions, expose a dedicated read route for backend-to-backend indexing or
allow service credentials for this endpoint and enforce visibility through the
search result `authorization` block shown below.

### Step 3: Register the collator with the search backend

Wire the factory into a `search` backend module, scheduled however often you
want the index refreshed. Most plugins re-index every 10 minutes in
development and once an hour in production:

```ts
// plugins/search-backend-module-todo/src/module.ts
import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { searchIndexRegistryExtensionPoint } from '@backstage/plugin-search-backend-node/alpha';
import { TodoCollatorFactory } from './TodoCollatorFactory';

export const searchModuleTodoCollator = createBackendModule({
  pluginId: 'search',
  moduleId: 'todo-collator',
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

Adopters install the module the same way they install any other backend
module — one `backend.add(...)` call in their `packages/backend/src/index.ts`.

### Step 4: Respect permissions during indexing

If you defined a `todo.read` resource permission in the
[permissions chapter](003-permissions.md), reuse it here so users only see
matches they are actually allowed to read. Set `visibilityPermission` on the
factory and emit an `authorization` block on each document:

```ts
import { todoReadPermission } from '@internal/plugin-todo-common';

export class TodoCollatorFactory implements DocumentCollatorFactory {
  public readonly type = TODO_SEARCH_TYPE;
  public readonly visibilityPermission = todoReadPermission;

  // ...

  private async *execute(): AsyncGenerator<TodoSearchDocument> {
    const { items } = await this.listTodos();

    for (const todo of items) {
      yield {
        title: todo.title,
        text: `Created by ${todo.createdBy}`,
        location: (this.options.locationTemplate ?? '/todo/:id').replace(
          ':id',
          encodeURIComponent(todo.id),
        ),
        createdBy: todo.createdBy,
        createdAt: todo.createdAt,
        authorization: { resourceRef: todo.id },
      };
    }
  }
}
```

When the search engine returns a hit, the search backend will call your
permission policy with `todoReadPermission` and the `resourceRef`, dropping
results the user is not allowed to see before they ever reach the UI.

### Step 5: Render todo results on the frontend

Finally, register a result item component for the new document type. The
search result list resolves each hit against the registered components and
falls back to a generic renderer when none matches:

```diff title="plugins/todo/src/plugin.tsx"
+import { SearchResultListItemBlueprint } from '@backstage/plugin-search-react/alpha';
+import { TODO_SEARCH_TYPE } from '@internal/plugin-todo-common';

+export const todoSearchResultListItem = SearchResultListItemBlueprint.make({
+  params: {
+    predicate: result => result.type === TODO_SEARCH_TYPE,
+    component: () =>
+      import('./components/TodoSearchResultListItem').then(
+        m => m.TodoSearchResultListItem,
+      ),
+  },
+});
+
 export const todoPlugin = createFrontendPlugin({
   pluginId: 'todo',
-  extensions: [page],
+  extensions: [page, todoSearchResultListItem],
   routes: {
     root: rootRouteRef,
   },
 });
```

With the extension registered, matches against the `todo` document type now
render with whatever rich display you want — creator, creation time, or a
status pill if your plugin adds statuses later — instead of a generic title and
snippet.
