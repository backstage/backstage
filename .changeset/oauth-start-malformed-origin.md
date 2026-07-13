---
'@backstage/plugin-auth-node': patch
---

The OAuth `start` endpoint now responds with a `400` for a malformed `origin` query parameter instead of failing with a `500`.
