---
'@backstage/plugin-app-react-router-v6': minor
---

Added a new package that provides `ReactRouterV6PageRouter`, a page router that renders new frontend system pages with React Router v6. Render it inside the lazily loaded component of each page or sub-page whose content should get a v6 context.

React Router v6 is a peer dependency rather than a bundled one, so the adapter binds to the same copy of `react-router-dom` the page's own content imports. A page whose adapter came from one copy and whose `useParams` came from another would read an empty context, because React Router contexts are not shared between copies.

Pages keep composing their content with React Router as usual, so relative links, nested `<Routes>` and `useParams` all work, while browser history stays owned by the app. The adapter renders whatever content it is given inside a v6 context scoped to the page or sub-page that declared it, and builds no routes of its own. Declaring it in a sub-page's React component scopes it to that sub-page rather than to the page above. Adapters from different routing libraries nest rather than replace one another, so this one composes with them in either order.
