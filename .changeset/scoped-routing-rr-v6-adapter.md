---
'@backstage/plugin-react-router-v6-adapter': patch
---

Adds a React Router v6 page adapter that injects library routing context from a scoped routing contract without writing browser history, including back/forward through the contract stack helpers and compilation of route descriptors into in-page routes. Opaque React Router children continue to work when descriptors are not used.
