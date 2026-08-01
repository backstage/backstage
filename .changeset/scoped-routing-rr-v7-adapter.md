---
'@backstage/plugin-react-router-v7-adapter': patch
---

Added a new package that provides `ReactRouterV7PageRouter`, a page router that renders new frontend system pages with React Router v7. Attach it to a page's `router` input with `PageRouterBlueprint`, or register it as the app-wide default through `pageRouterApiRef`.

Pages keep composing their content with React Router as usual — relative links, nested `<Routes>` and `useParams` all work — while browser history stays owned by the app. The adapter receives the page's sub-pages as data and builds its own v7 route for each one, so it can host a page with tabs, and a sub-page that picks a different router renders its own content with that library. React Router v7 and v6 can therefore run side by side on the same page.
