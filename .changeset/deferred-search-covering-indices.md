---
'@backstage/plugin-catalog-backend': minor
---

Added deferred background creation of covering indices on the `search` table for improved query performance. On PostgreSQL, indices are created concurrently after service startup to avoid blocking readiness and causing Kubernetes liveness probe failures on large databases. Advisory locking coordinates creation across multiple pods, and interrupted attempts are automatically cleaned up and retried.
