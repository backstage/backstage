---
'@backstage/plugin-catalog-backend': patch
---

When parsing filters, do not make redundant `anyOf` and `allOf` nodes when there's only a single entry within them
