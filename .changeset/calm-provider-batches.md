---
'@backstage/plugin-catalog-backend': patch
---

Improved large entity provider mutations by yielding to the event loop while preparing database changes.
