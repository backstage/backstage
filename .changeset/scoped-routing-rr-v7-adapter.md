---
'@backstage/plugin-react-router-v7-adapter': patch
---

Added a new package that provides `ReactRouterV7PageRouter`, a page router that renders new frontend system pages with React Router v7. Attach it to a page's `router` input with `PageRouterBlueprint`, or register it as the app-wide default through `pageRouterApiRef`.

Pages keep composing their content with React Router as usual — relative links, nested `<Routes>` and `useParams` all work — while browser history stays owned by the app. The adapter renders whatever content the page is showing inside a v7 context scoped to that page, and builds no routes of its own, so it can host a page with tabs as well as one that renders a single element. A sub-page that attaches a different router renders its own content with that library. React Router v7 and v6 can therefore run side by side on the same page.
