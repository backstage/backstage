---
'@backstage/backend-test-utils': minor
---

**BREAKING**: The `MYSQL_8` test database now uses MySQL 8.4 (the current LTS release) instead of the floating `mysql:8` Docker tag which had moved to 8.4.x. The `--default-authentication-plugin` startup flag has been replaced with `--mysql-native-password=ON` which is the 8.4+ equivalent. If you rely on the `TestDatabases` facility with MySQL, your tests will now run against MySQL 8.4 and you may need to update any custom MySQL connection strings or Docker image overrides accordingly. The connection pool size has also been reduced from 50 to 5 per test database, and idle/stale connections are now reaped automatically.
