---
'@backstage/plugin-react-router-v7-adapter': patch
---

Adds a React Router v7 page adapter (`ReactRouterV7PageRouter`) that injects library routing context from a scoped routing contract without writing browser history, including back/forward through the contract stack helpers and compilation of route descriptors into in-page routes. Register the adapter with `PageRouterBlueprint` or `pageRouterApiRef`.
