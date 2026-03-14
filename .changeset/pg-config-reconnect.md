---
'@backstage/backend-defaults': patch
---

The postgres database connector now automatically reconnects the connection pool when the underlying configuration changes, for example when environment-injected secrets in the configuration change.
