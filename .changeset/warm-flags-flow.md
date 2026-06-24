---
'@backstage/cli-module-build': patch
---

Added support for passing custom flags to the embedded postgres processes via `backend.database.connection.flags.postgres` and `backend.database.connection.flags.initdb` configuration properties.
