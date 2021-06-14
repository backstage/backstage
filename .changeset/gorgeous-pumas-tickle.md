---
'@backstage/plugin-catalog-backend': patch
---

Rely on `SELECT ... FOR UPDATE SKIP LOCKED` where available in order to speed up processing item acquisition and reduce work duplication.
