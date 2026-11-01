---
'@backstage/plugin-catalog-backend': patch
---

Improved the performance of entity queries on PostgreSQL when a filter matches a field against a long list of values, such as the ownership claims used by conditional permission policies for catalog entity reads.
