---
'@backstage/plugin-catalog-backend': minor
---

The search index now does retain fields that have a very long value, but in the form of just a null. This makes it possible to at least filter for their existence.
