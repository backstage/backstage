---
'@backstage/plugin-catalog-backend': minor
---

The `entities/by-query` endpoint now supports sorting by multiple `orderField` query parameters. Later fields break ties between earlier ones, and cursor pagination works across all of them.
