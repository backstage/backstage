---
'@backstage/frontend-app-api': patch
---

The analytics context of `navigate` events now includes `routeRef` again when the page is mounted with one of its plugin's routes. Its value is the route's name in the form `<pluginId>.<routeKey>`, such as `catalog.catalogEntity`, so navigation can be tied to a named route like in the old frontend system.
