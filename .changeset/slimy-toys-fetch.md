---
'@backstage/plugin-catalog-backend': patch
---

Only validate the envelope for emitted entities, and defer full validation to when they get processed later on.
