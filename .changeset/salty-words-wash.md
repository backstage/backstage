---
'@backstage/backend-defaults': minor
---

Adds support for configuring server-level HTTP options through the
`app-config.yaml` file under the `backend.server` key. Supported options
include `headersTimeout`, `keepAliveTimeout`, `requestTimeout`, `timeout`,
`maxHeadersCount`, and `maxRequestsPerSocket`.

These are passed directly to the underlying Node.js HTTP server.
If omitted, Node.js defaults are used.
