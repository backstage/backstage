---
'@backstage/core-api': patch
---

Deprecated the `ConcreteRoute`, `MutableRouteRef`, `AbsoluteRouteRef` types and added a new `RouteRef` type as replacement.

Deprecated and disabled the `createSubRoute` method of `AbsoluteRouteRef`.

Add an as of yet unused `params` option to `createRouteRef`.
