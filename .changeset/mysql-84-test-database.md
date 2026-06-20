---
'@backstage/backend-test-utils': patch
---

Fixed MySQL test database failures by pinning the Docker image from the floating `mysql:8` tag to `mysql:8.4` and replacing a startup flag that was removed in MySQL 8.4. Parallel Jest workers now share a single database container via container reuse (disable with `TESTCONTAINERS_REUSE_ENABLE=false`), reducing memory pressure from ~640 MB per worker to a single shared instance. The connection pool has been reduced and idle connections are now reaped automatically.
