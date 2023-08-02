---
'@backstage/plugin-search-backend-module-catalog': patch
---

Move collator settings from module options into app-config. You are now expected to set up the catalog collator under the `search.collators.catalog` configuration key.
