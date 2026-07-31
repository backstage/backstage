---
'@backstage/plugin-react-router-v7-adapter': patch
---

Adds a React Router v7 page adapter (`ReactRouterV7PageRouter`) that injects library routing context projected from the app's `AppHistoryApi`, without writing browser history directly. An existing React Router `<Routes>` tree composed by the page keeps working as opaque `children` (relative links, nested `<Routes>`, `useParams`, and so on). Register the adapter with `PageRouterBlueprint` or `pageRouterApiRef`.
