---
'@backstage/integration': patch
---

Narrow the types returned by the request option functions, to only the specifics that they actually do return. The reason for this change is that a full `RequestInit` is unfortunate to return because it's different between `cross-fetch` and `node-fetch`.
