---
'@backstage/plugin-app': patch
---

The app now provides the default page router for scoped plugin routing ([RFC #33603](https://github.com/backstage/backstage/issues/33603)): pages and sub-pages that leave their `router` input empty render with React Router v6, so `react-router-dom` usage inside plugin pages keeps working. Top level pages are selected from the app history rather than from a router component at the app root, the app shell keeps a React Router context so chrome components that rely on it are unaffected, and page header tabs and breadcrumbs resolve against the page that is currently mounted.
