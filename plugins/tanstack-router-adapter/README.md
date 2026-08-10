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

Pages built from sub-pages (tabs) are supported: the framework's own route matching picks the sub-page to show, and this adapter renders whatever it is given. Content is always opaque, whether it comes from a `PageBlueprint` `loader` or from a sub-page — if it routes internally with another library, that is the page author's choice, made alongside their choice of this adapter. Attach this adapter to a sub-page as well to give that sub-page's content a TanStack context scoped to the sub-page itself.

- Programmatic back, forward and `go` warn and do nothing. There is a single, real browser history; use the browser's own back and forward.
- `useBlocker` only intercepts navigation started from within this page. It does not see navigation coming from elsewhere in the app.
