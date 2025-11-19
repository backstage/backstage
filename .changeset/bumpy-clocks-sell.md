---
'@backstage/core-compat-api': patch
'@backstage/frontend-plugin-api': minor
'@backstage/frontend-test-utils': minor
'@backstage/frontend-app-api': minor
'@backstage/plugin-app': patch
'@backstage/frontend-module-react-router-v6': minor
---

Introduced a router-agnostic `RouterApi` in `@backstage/frontend-plugin-api` that abstracts routing from the underlying router implementation. The React Router 6 implementation has been moved to a new package `@backstage/frontend-module-react-router-v6`. For testing, `@backstage/frontend-test-utils` provides `MockMemoryRouterApi` and `MockBrowserRouterApi` along with `TestMemoryRouterProvider` and `TestBrowserRouterProvider`.

**Hooks and components** can now be imported directly from `@backstage/frontend-plugin-api`:

```diff
- import { useLocation, useNavigate, useParams, Link, NavLink, Routes, Route, Outlet } from 'react-router-dom';
+ import { useLocation, useNavigate, useParams, Link, NavLink, Routes, Route, Outlet } from '@backstage/frontend-plugin-api';
```

A development-time warning has been added to detect multi-segment splat paths (e.g., `dashboard/*`) for react-router v7 compatibility. See: <https://reactrouter.com/upgrading/v6#v7_relativesplatpath>
