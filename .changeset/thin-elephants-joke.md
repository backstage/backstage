---
'@backstage/cli-module-build': patch
'@backstage/backend-defaults': patch
---

Added experimental support for using `embedded-postgres` as the database for local development. Set `backend.database.client` to `embedded-postgres` in your app config to enable this. The `embedded-postgres` package must be installed as an explicit dependency in your project.
