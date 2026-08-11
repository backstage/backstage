# @backstage/plugin-react-router-v7-adapter

Renders new frontend system pages with [React Router v7](https://reactrouter.com), so a page can use `react-router` / `react-router-dom` v7 while the rest of the app stays on the default React Router v6. Part of scoped plugin routing, RFC [#33603](https://github.com/backstage/backstage/issues/33603).

Browser history stays owned by the app: this package never writes to `window.history` itself, it only scopes React Router to the page it renders.

## Usage

Attach `ReactRouterV7PageRouter` to a page's `router` input with `PageRouterBlueprint`:

```tsx
import { PageRouterBlueprint } from '@backstage/frontend-plugin-api';
import { ReactRouterV7PageRouter } from '@backstage/plugin-react-router-v7-adapter';

const myV7Router = PageRouterBlueprint.make({
  attachTo: { id: 'page:my-plugin', input: 'router' },
  params: {
    component: ReactRouterV7PageRouter,
  },
});
```

The page keeps composing its own content — an existing `<Routes>` tree, relative `Link`s, nested `<Routes>` and `useParams` all keep working.

Programmatic back and forward, such as `navigate(-1)`, traverse the app-owned browser history.
