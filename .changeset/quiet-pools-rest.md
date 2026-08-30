---
'@backstage/backend-defaults': patch
---

Stopped issuing periodic per-plugin database keepalive queries, allowing configured connection pool idle timeouts to retire unused connections.
