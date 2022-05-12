---
'@backstage/plugin-techdocs-backend': patch
---

Fixed a bug that could cause TechDocs index generation to hang and fail when an underlying TechDocs site's `search_index.json` was empty.
