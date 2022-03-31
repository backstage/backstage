---
'@backstage/backend-test-utils': patch
---

`TestDatabases.create` will no longer set up an `afterAll` test handler if no databases are supported.
