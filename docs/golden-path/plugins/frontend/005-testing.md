---
id: testing
sidebar_label: 005 - Testing
title: 005 - Testing
description: How to write tests for your Backstage frontend plugin components
---

The scaffolded plugin comes with tests already in place. Let's walk through
how they work and how to extend them.

## Unit tests

Backstage frontend plugins use **Jest** as the test runner,
**React Testing Library** for rendering components, and **MSW**
(Mock Service Worker) for intercepting HTTP requests.

### TodoList tests

Open `plugins/todo/src/components/TodoList/TodoList.test.tsx`. The `TodoList`
component is presentational, so testing it is straightforward — pass in data
and verify it renders:

```tsx
await renderInTestApp(<TodoList todos={todos} />);

expect(screen.getByText('First task')).toBeInTheDocument();
```

`renderInTestApp` from `@backstage/frontend-test-utils` sets up a minimal
Backstage app context around the component, providing all the standard APIs
that components might depend on.

### TodoPage tests

Open `plugins/todo/src/components/TodoPage/TodoPage.test.tsx`. The `TodoPage`
component fetches data from the backend, so the tests use MSW to intercept
HTTP requests and return test data:

```tsx
const server = setupServer();
registerMswTestHooks(server);

it('renders todos from the backend', async () => {
  server.use(
    rest.get('*/api/todo/todos', (req, res, ctx) =>
      res(
        ctx.json({
          items: [{ id: '1', title: 'Mocked task' /* ... */ }],
        }),
      ),
    ),
  );

  await renderInTestApp(<TodoPage />);

  expect(await screen.findByText('Mocked task')).toBeInTheDocument();
});
```

A few things to note:

- **`registerMswTestHooks`** sets up and tears down the MSW server around
  each test, so handlers do not leak between tests.
- **`screen.findByText`** returns a promise that waits for the element to
  appear. This handles the asynchronous nature of data fetching without
  needing explicit `waitFor` calls.
- The URL pattern `*/api/todo/todos` matches regardless of the host, which
  keeps the test independent of the discovery API's resolved base URL.

The tests also cover the error case — when the backend returns a 500 status,
the component falls back to rendering example todo items instead of
displaying an error panel.

### Running the tests

From the repository root:

```sh
yarn test plugins/todo
```

### Writing additional tests

As you add features to your plugin, follow the same patterns:

- For presentational components, pass props and assert on rendered output.
- For components that fetch data, use MSW to mock the HTTP responses.
- Prefer `screen.findByText` over `waitFor` for async assertions.
- Test both the success and error paths.

## Integration tests

For end-to-end validation, you can use **Playwright** to test your plugin in
a real browser against a running Backstage instance. Integration tests catch
issues that unit tests cannot, such as routing problems, CSS regressions, or
issues with the full API round-trip.

A basic Playwright test for the todo page might look like this:

```ts
import { test, expect } from '@playwright/test';

test('todo page shows the todo list', async ({ page }) => {
  await page.goto('/todo');
  await expect(page.getByText('Welcome to todo!')).toBeVisible();
  await expect(page.getByRole('table')).toBeVisible();
});
```

Integration tests are most valuable for critical user flows. For most
component-level validation, the unit testing approach described above
provides faster feedback with less setup.
