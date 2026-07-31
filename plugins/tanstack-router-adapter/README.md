# @backstage/plugin-tanstack-router-adapter

Renders new frontend system pages with [TanStack Router](https://tanstack.com/router), scoped to the page's own path. Part of scoped plugin routing, RFC [#33603](https://github.com/backstage/backstage/issues/33603).

Browser history stays owned by the app: this package never writes to `window.history` itself, it only scopes TanStack Router to the page it renders.

## Usage

Attach `TanStackPageRouter` to a page's `router` input with `PageRouterBlueprint`:

```tsx
import { PageRouterBlueprint } from '@backstage/frontend-plugin-api';
import { TanStackPageRouter } from '@backstage/plugin-tanstack-router-adapter';

const tanstackRouter = PageRouterBlueprint.make({
  attachTo: { id: 'page:my-plugin', input: 'router' },
  params: {
    component: TanStackPageRouter,
  },
});
```

## Limits

TanStack Router renders through its own route tree and cannot host React Router content, so this package only supports pages that render a single content element. Pages built from sub-pages or tabs must keep a React Router page router; if this adapter is made the app-wide default through `pageRouterApiRef`, those pages fail fast with a clear error.

- Programmatic back, forward and `go` warn and do nothing. There is a single, real browser history; use the browser's own back and forward.
- `useBlocker` only intercepts navigation started from within this page. It does not see navigation coming from elsewhere in the app.
