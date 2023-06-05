---
'@backstage/core-app-api': patch
'@backstage/core-plugin-api': patch
---

Fixed a bug that prevented accurate plugin and route data from being applied to `navigate` analytics events when users visited pages constructed with `<EntityLayout>`, `<TabbedLayout>`, and similar components that are used to gather one or more routable extensions under a given path.
