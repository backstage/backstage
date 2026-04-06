---
'@backstage/frontend-plugin-api': minor
---

Simplified the type signature of `createRouteRef` by replacing the dual `TParams`/`TParamKeys` type parameters with a single `TParamKey` parameter. This is a breaking change for callers that explicitly provided type arguments, but most usage that relies on inference is unaffected.
