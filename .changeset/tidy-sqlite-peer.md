---
'@backstage/backend-test-utils': major
---

**BREAKING**: `better-sqlite3` is now an optional peer dependency instead of a regular dependency. Consumers that use SQLite must add `better-sqlite3@^12.0.0` to their package's development dependencies. PostgreSQL-only consumers can use `TestDatabases.create({ ids: ['POSTGRES_17'] })` without installing the SQLite driver.

Embedded PostgreSQL provides an alternative to SQLite for local development, making PostgreSQL-only setups a practical option. These setups no longer need to install a native SQLite driver just to use the backend test utilities.
