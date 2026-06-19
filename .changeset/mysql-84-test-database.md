---
'@backstage/backend-test-utils': patch
---

The MySQL test database image has been pinned from the floating `mysql:8` tag to `mysql:8.4`, fixing container startup failures caused by a removed configuration flag in newer MySQL 8.4.x releases. The connection pool has been reduced and idle connections are now reaped automatically, improving stability under CI load.
