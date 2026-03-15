---
'@backstage/core-compat-api': patch
'@backstage/frontend-plugin-api': minor
'@backstage/frontend-test-utils': minor
'@backstage/frontend-app-api': minor
'@backstage/frontend-module-react-router-v6': minor
---

Introduced a router-agnostic `RouterApi` in `@backstage/frontend-plugin-api` that abstracts routing from the underlying router implementation. Routing hooks and components like `useNavigate`, `useLocation`, `useParams`, `Link`, `NavLink`, `Routes`, `Route`, and `Outlet` can now be imported directly from `@backstage/frontend-plugin-api` instead of `react-router-dom`. The React Router 6 implementation has been moved to a new `@backstage/frontend-module-react-router-v6` module. For testing, `@backstage/frontend-test-utils` provides `MockMemoryRouterApi` and `MockBrowserRouterApi` along with `TestMemoryRouterProvider` and `TestBrowserRouterProvider`. A development-time warning has been added to detect multi-segment splat paths (e.g., `dashboard/*`) for react-router v7 compatibility.
