---
'@backstage/backend-test-utils': patch
---

The backend started by `startTestBackend` now has default implementations of all core services. It now also returns a `TestBackend` instance, which provides access to the underlying `server` that can be used with testing libraries such as `supertest`.
