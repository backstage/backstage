---
'@backstage/catalog-client': minor
---

The client now automatically splits up very large `getEntitiesByRefs` calls into several smaller requests behind the scenes when needed. This ensures that each individual request does not exceed common Express.js request body limits or overload the server.
