# @backstage/plugin-app-react-router-v7

Renders a page of the [new frontend system](https://backstage.io/docs/frontend-system/)
with [React Router v7](https://reactrouter.com), so that one page can use
`react-router` and `react-router-dom` v7 while the rest of the app stays on the
default v6.

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

Attach `ReactRouterV7PageRouter` to a page's `router` input with
`PageRouterBlueprint`:

```tsx
import { PageRouterBlueprint } from '@backstage/frontend-plugin-api';
import { ReactRouterV7PageRouter } from '@backstage/plugin-app-react-router-v7';

const toolsPageRouter = PageRouterBlueprint.make({
  attachTo: { id: 'page:tools', input: 'router' },
  params: {
    component: ReactRouterV7PageRouter,
  },
});
```

The page keeps composing its own content. A `<Routes>` tree the page builds
itself works as usual, as do relative `Link`s, nested `<Routes>`, and
`useParams`.

To scope a v7 context to a single tab rather than to the whole page, attach the
adapter to the sub-page instead, for example
`attachTo: { id: 'sub-page:tools/overview', input: 'router' }`.

## Documentation

- [Scoped plugin routing](https://backstage.io/docs/frontend-system/architecture/routes#scoped-plugin-routing)
- [Backstage Documentation](https://backstage.io/docs)
