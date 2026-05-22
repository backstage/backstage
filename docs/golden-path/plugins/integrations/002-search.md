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

### Define the document type

A collator emits documents that implement `IndexableDocument`. The base type
already includes `title`, `text`, and `location`; extend it with the fields
you want to search on or display:

```ts
// plugins/todo-common/src/TodoSearchDocument.ts
import type { IndexableDocument } from '@backstage/plugin-search-common';

export interface TodoSearchDocument extends IndexableDocument {
  status: 'open' | 'in-progress' | 'done';
  owner: string;
  dueDate?: string;
}

export const TODO_SEARCH_TYPE = 'todo';
```

Export the document type and the `TODO_SEARCH_TYPE` string from your common
package. The frontend will key its result item off the same string, so
sharing it through `todo-common` prevents drift.

### Build the collator factory

Implement `DocumentCollatorFactory`. The `type` field is the document type
the engine indexes against; `getCollator` returns a `Readable` stream of your
documents. Yield them from an async generator so the factory backpressures
naturally for large todo sets:

```ts
// plugins/search-backend-module-todo/src/TodoCollatorFactory.ts
import { Readable } from 'stream';
import {
  DocumentCollatorFactory,
  IndexableDocument,
} from '@backstage/plugin-search-common';
import {
  TODO_SEARCH_TYPE,
  TodoSearchDocument,
} from '@internal/plugin-todo-common';
import type { TodoListService } from './services';

export class TodoCollatorFactory implements DocumentCollatorFactory {
  public readonly type = TODO_SEARCH_TYPE;

  constructor(
    private readonly todoList: TodoListService,
    private readonly locationTemplate = '/todo/:namespace/:id',
  ) {}

  async getCollator(): Promise<Readable> {
    return Readable.from(this.execute());
  }

  private async *execute(): AsyncGenerator<TodoSearchDocument> {
    let cursor: string | undefined;
    do {
      const { items, nextCursor } = await this.todoList.listTodos({
        cursor,
        limit: 200,
      });
      cursor = nextCursor;

      for (const todo of items) {
        yield {
          title: todo.title,
          text: todo.description ?? '',
          location: this.locationTemplate
            .replace(':namespace', encodeURIComponent(todo.namespace))
            .replace(':id', encodeURIComponent(todo.id)),
          status: todo.status,
          owner: todo.owner,
          dueDate: todo.dueDate,
        };
      }
    } while (cursor);
  }
}
```

The `location` field is what users click on in the result list, so make sure
it routes to the page on your frontend that actually shows the todo.

### Register the collator with the search backend

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
import { todoListServiceRef } from '@internal/plugin-todo-backend';
import { TodoCollatorFactory } from './TodoCollatorFactory';

export const searchModuleTodoCollator = createBackendModule({
  pluginId: 'search',
  moduleId: 'todo-collator',
  register(env) {
    env.registerInit({
      deps: {
        scheduler: coreServices.scheduler,
        indexRegistry: searchIndexRegistryExtensionPoint,
        todoList: todoListServiceRef,
      },
      async init({ scheduler, indexRegistry, todoList }) {
        indexRegistry.addCollator({
          schedule: scheduler.createScheduledTaskRunner({
            frequency: { minutes: 10 },
            timeout: { minutes: 5 },
            initialDelay: { seconds: 30 },
          }),
          factory: new TodoCollatorFactory(todoList),
        });
      },
    });
  },
});
```

Adopters install the module the same way they install any other backend
module — one `backend.add(...)` call in their `packages/backend/src/index.ts`.

### Respect permissions during indexing

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
    for await (const todo of /* ... */) {
      yield {
        // ...other fields
        authorization: { resourceRef: todo.id },
      };
    }
  }
}
```

When the search engine returns a hit, the search backend will call your
permission policy with `todoReadPermission` and the `resourceRef`, dropping
results the user is not allowed to see before they ever reach the UI.

### Render todo results on the frontend

Finally, register a result item component for the new document type. The
search result list resolves each hit against the registered components and
falls back to a generic renderer when none matches:

```tsx
// plugins/todo/src/plugin.ts
import {
  createPlugin,
  createSearchResultListItemExtension,
} from '@backstage/plugin-search-react';
import { TODO_SEARCH_TYPE } from '@internal/plugin-todo-common';

export const todoPlugin = createPlugin({ id: 'todo' /* ... */ });

export const TodoSearchResultListItem = todoPlugin.provide(
  createSearchResultListItemExtension({
    name: 'TodoSearchResultListItem',
    predicate: result => result.type === TODO_SEARCH_TYPE,
    component: () =>
      import('./components/TodoSearchResultListItem').then(
        m => m.TodoSearchResultListItem,
      ),
  }),
);
```

Adopters drop `<TodoSearchResultListItem />` inside their search result list,
and matches against the `todo` document type now render with whatever rich
display you want — status pill, owner avatar, due date — instead of a
generic title and snippet.
