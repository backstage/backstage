---
'@backstage/plugin-events-backend': patch
'@backstage/plugin-events-node': minor
---

The requests passed to request validators now include the parsed query string. The request rejection details now also
support an optional `contentType` option for the provided payload, defaulting to `application/json` but also allowing
`text/plain`.
