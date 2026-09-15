---
'@backstage/plugin-app-react-router-v7': minor
---

Added a new package that provides `ReactRouterV7PageRouter`, a page router that renders new frontend system pages with React Router v7. Render it inside the `loader` of the page or sub-page whose content should get a v7 context.

Pages keep composing their content with React Router as usual, so relative links, nested `<Routes>` and `useParams` all work, while browser history stays owned by the app. The adapter renders whatever content it is given inside a v7 context scoped to the page or sub-page that declared it, and builds no routes of its own. Declaring it in a sub-page's `loader` scopes it to that sub-page rather than to the page above. Because v6 and v7 publish different React contexts, a v7 page and a v6 page — or a v7 tab and a v6 tab of one page — coexist without either shadowing the other.
