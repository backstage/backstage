---
'@backstage/plugin-react-router-v7-adapter': patch
---

Added a new package that provides `ReactRouterV7PageRouter`, a page router that renders new frontend system pages with React Router v7. Attach it to a page's `router` input with `PageRouterBlueprint`, or register it as the app-wide default through `pageRouterApiRef`.

Pages keep composing their content with React Router as usual — relative links, nested `<Routes>` and `useParams` all work — while browser history stays owned by the app.
