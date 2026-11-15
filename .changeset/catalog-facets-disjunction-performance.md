---
'@backstage/plugin-catalog-backend': patch
---

Improved the performance of entity facets and total item counts on PostgreSQL when the filter contains `$any` or `$not` conditions, such as those produced by conditional permission policies for catalog entity reads.
