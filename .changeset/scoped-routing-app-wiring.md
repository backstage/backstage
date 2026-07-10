---
'@backstage/frontend-app-api': patch
---

Adds the framework-owned navigation controller and app route switch for scoped plugin routing under the new frontend system (RFC #33603). Production apps select top-level pages through the route table and navigation controller instead of a root react-router `useRoutes` tree. Shared pre-navigation blockers apply to chrome and page adapters. Exports `AppRouteSwitch` and `RouteTable` for app wiring.
