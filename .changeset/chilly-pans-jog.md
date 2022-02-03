---
'@backstage/plugin-todo': minor
---

**BREAKING**: The `EntityTodoContent` is now a routable extension. This means it must be rendered within a route, but that's most likely already the case for most apps. The mount point `RouteRef` is available via `todoPlugin.routes.entityContent`.
