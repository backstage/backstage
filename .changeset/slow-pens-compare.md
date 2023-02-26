---
'@backstage/plugin-catalog-backend': patch
---

Fix a bug where the batch fetch by ref endpoint did not work in conjunction with filtering (e.g. if authorization was enabled).
