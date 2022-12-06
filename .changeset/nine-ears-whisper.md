---
'@backstage/plugin-events-backend': patch
'@backstage/plugin-events-node': minor
---

Introduce a new interface `RequestDetails` to abstract `Request`
providing access to request body and headers.

**BREAKING:** Replace `request: Request` with `request: RequestDetails` at `RequestValidator`.
