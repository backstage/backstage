---
'@backstage/cli-module-build': patch
---

The embedded Postgres database used during local development now respects user-provided connection configuration. If you configure `host`, `port`, `user`, or `password` under `backend.database.connection` alongside the `embedded-postgres` database client, those values will be forwarded to the embedded Postgres instance. Only values that you have not configured will be filled in with defaults. This makes it possible to run the embedded database on a specific host and port, for example to connect to it externally with `psql`.
