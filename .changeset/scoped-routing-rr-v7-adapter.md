---
'@backstage/plugin-react-router-v7-adapter': patch
---

Adds a React Router v7 page adapter that injects library routing context from a scoped routing contract without writing browser history. Pages can attach it via the optional page `router` input to override the default React Router v6 adapter. Supports contract stack helpers for back/forward and compiles route descriptors into in-page routes; opaque React Router children continue to work when descriptors are not used.
