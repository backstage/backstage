---
'@backstage/plugin-app': patch
---

The app now provides the default page router for scoped plugin routing ([RFC #33603](https://github.com/backstage/backstage/issues/33603)): pages and sub-pages that leave their `router` input empty render with React Router v6, so `react-router-dom` usage inside plugin pages keeps working. Top level pages are selected from the app history rather than from a router component at the app root, the app shell keeps a React Router context so chrome components that rely on it are unaffected, and page header tabs and breadcrumbs resolve against the page that is currently mounted.

A page's sub-pages are now handed to its page router as data rather than as a ready-made React Router route tree, and the router builds its own routes from them. Any routing library can therefore host a page with tabs, not only React Router, and a page's tabs and its tab content can be rendered by different libraries.

This also fixes two problems:

- Design system tabs, header navigation, menu items and button links now include the app's deploy base path in their href. Under a sub-path deployment, middle-clicking one, opening it in a new tab, copying its address, or letting a crawler follow it now lands on the right page instead of dropping the sub-path. A left click was unaffected.
- Page content is no longer torn down and rebuilt whenever the surrounding app shell re-renders. Moving between two URLs that the same page serves, for example from one entity to another, keeps the page mounted, so scroll position, open dialogs, in-progress form input and in-flight requests survive the navigation.
