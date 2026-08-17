---
'@backstage/plugin-catalog-backend': patch
---

Fixed an issue where PostgreSQL deadlock errors during entity provider mutations were silently swallowed, causing entities to be dropped until the next full refresh. Transactions are now automatically retried on deadlock with exponential back-off.
