---
'@backstage/core-compat-api': patch
'@backstage/frontend-plugin-api': minor
'@backstage/frontend-test-utils': minor
'@backstage/frontend-app-api': minor
'@backstage/plugin-app': patch
---

Introduced a new `RouterApi` interface and `routerApiRef` in `@backstage/frontend-plugin-api` that abstracts routing operations from the underlying router implementation. This includes new routing hooks (`useLocation`, `useNavigate`, `useParams`, `useSearchParams`, `useResolvedPath`, `useHref`) and components (`Link`, `NavLink`, `Outlet`) that work through the API abstraction.

The default React Router 6 implementation is provided via `ReactRouter6RouterApi` and `reactRouter6RouterApi` in `@backstage/frontend-app-api`. For testing, `TestRouterApi` is available in `@backstage/frontend-test-utils` which uses a `MemoryRouter`.

**Migration from `react-router-dom`:**

For hooks and most components, update your imports:

```diff
- import { useLocation, useNavigate, Link, NavLink, Outlet } from 'react-router-dom';
+ import { useLocation, useNavigate, Link, NavLink, Outlet } from '@backstage/frontend-plugin-api';
```

For `Routes` and `Route`, access them via the API (they cannot be wrapped due to react-router's internal type checking):

```diff
- import { Routes, Route } from 'react-router-dom';
+ import { useApi, routerApiRef } from '@backstage/frontend-plugin-api';

  function MyComponent() {
+   const { Routes, Route } = useApi(routerApiRef);
    return (
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    );
  }
```
