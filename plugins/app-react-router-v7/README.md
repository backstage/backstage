# @backstage/plugin-app-react-router-v7

Renders a page of the [new frontend system](https://backstage.io/docs/frontend-system/)
with [React Router v7](https://reactrouter.com), so that one page can use
`react-router` and `react-router-dom` v7 while other pages in the same app
render with a different routing library, or with none at all.

Browser history belongs to the app. This package never writes to
`window.history`. It only scopes React Router to the page it renders, so
programmatic back and forward, such as `navigate(-1)`, traverse the app-owned
history.

This package is part of scoped plugin routing,
[RFC #33603](https://github.com/backstage/backstage/issues/33603).

## Installation

React Router v7 is a peer dependency, so install it alongside the adapter:

```sh
cd <package-dir> # if within a monorepo
yarn add @backstage/plugin-app-react-router-v7 react-router@^7 react-router-dom@^7
```

## Usage

Render `ReactRouterV7PageRouter` inside the `loader` of the page whose
content should get the context:

```tsx
import { PageBlueprint } from '@backstage/frontend-plugin-api';
import { ReactRouterV7PageRouter } from '@backstage/plugin-app-react-router-v7';

const toolsPage = PageBlueprint.make({
  params: {
    path: '/tools',
    loader: () =>
      import('./components/ToolsPage').then(m => (
        <ReactRouterV7PageRouter>
          <m.ToolsPage />
        </ReactRouterV7PageRouter>
      )),
  },
});
```

The page keeps composing its own content. A `<Routes>` tree the page builds
itself works as usual, as do relative `Link`s, nested `<Routes>`, and
`useParams`.

Existing pages retain an implicit React Router v6 compatibility context. This
explicit adapter takes effect where a `loader` renders it. Development warnings
identify content still consuming the implicit fallback. Adapters are added rather than
selected: React Router v7 publishes its own React context, so it nests with adapters
from other libraries instead of replacing them.

Rendering it in a sub-page's `loader` scopes it to that sub-page, because the
sub-page's own mount is what is in context there. Sibling tabs may declare
different libraries, or none at all.

Declare it at a route-bearing extension, such as a page or sub-page. An
`EntityContentBlueprint` tab, a card, or anything else filling a region of
another page already renders inside the adapter that page declared, one
route match deeper. A second adapter there re-scopes to the page's own mount and
drops the tab's match, so relative targets in that content resolve from the page
instead of from the tab.

## Where there is nothing to scope to

Scoping needs two things: a page mount, saying which part of the URL belongs to
the page, and a registered `AppHistoryApi` to project a location from. With
either missing, this adapter renders its children untouched and asks nothing of
the surrounding app — no API provider, no framework context.

That passthrough is what lets a plugin shipping for both frontend systems wrap a
shared component in the adapter. The old frontend system supplies neither half,
so the wrap is invisible there rather than a crash. The same holds in a plugin's
own `render()` unit tests, which stand up no app at all.

## Documentation

- [Scoped plugin routing](https://backstage.io/docs/frontend-system/architecture/routes#scoped-plugin-routing)
- [Backstage Documentation](https://backstage.io/docs)
