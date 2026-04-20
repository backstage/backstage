---
id: http-client
sidebar_label: 004 - HTTP Client
title: 004 - HTTP Client
description: How to build an HTTP client for your frontend plugin to fetch backend data
---

The scaffolded `TodoPage` already fetches data from the backend. Let's look at
how that works and how you can extend it.

## How the scaffolded code works

Open `plugins/todo/src/components/TodoPage/TodoPage.tsx` and look at the
`useTodos` hook:

```tsx
function useTodos() {
  const { fetch } = useApi(fetchApiRef);

  return useAsync(async (): Promise<TodoItem[]> => {
    const response = await fetch(`plugin://todo/todos`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch todos: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data.items;
  }, [fetch]);
}
```

Here, we're using Backstage's `fetchApi` which wraps the browser `fetch` and automatically does 2 things,

1. Injects authentication credentials - you don't need to attach any `Authorization` headers manually.
2. Resolves `plugin://<pluginId>` URL schemes to the real plugin URL for your instance.

The `useAsync` hook from `react-use` runs the async function on mount and
returns `{ value, loading, error }`, which the component uses to show a
loading spinner, example todo items if the backend request fails, or the
fetched todo list.

## Trying it out

Make sure both the frontend and backend are running (`yarn start` from the
repository root starts both). Navigate to `http://localhost:3000/todo` and
you should see todos fetched from your backend.

:::tip
You can create todos using `curl` as described in the
[backend golden path](../backend/002-poking-around.md), then refresh the
frontend page to see them appear.
:::

## Extracting a client class

<!-- TODO: Update this to be a Utility API + discuss mocking in tests. -->

For plugins with several endpoints, extracting a dedicated client class
keeps your components focused on rendering. Create
`plugins/todo/src/api/TodoClient.ts`:

```ts
import { FetchApi } from '@backstage/frontend-plugin-api';
import type { TodoItem } from '../components/TodoList';

export class TodoClient {
  readonly #fetchApi: FetchApi;

  constructor(options: { fetchApi: FetchApi }) {
    this.#fetchApi = options.fetchApi;
  }

  async listTodos(): Promise<TodoItem[]> {
    const response = await this.#fetchApi.fetch(`plugin://todo/todos`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch todos: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data.items;
  }

  async createTodo(title: string): Promise<TodoItem> {
    const response = await this.#fetchApi.fetch(`plugin://todo/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create todo: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }
}
```

This is optional for the scaffolded example, but becomes valuable as
your plugin grows.

## OpenAPI generated clients

You can also keep your frontend and backend in sync by generating the
client from an OpenAPI schema. If your backend plugin exposes an OpenAPI
spec (see the
[backend golden path](../backend/001-first-steps.md) for details),
you can generate a type-safe client that updates automatically whenever the
API changes. This approach reduces the risk of the frontend and backend
drifting apart over time.
