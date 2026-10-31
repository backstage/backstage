---
'@backstage/plugin-catalog-backend': patch
---

Improved the performance of entity facets, total item counts, and entity listings without a limit on PostgreSQL when the filter contains `$any` or `$not` conditions, such as those produced by conditional permission policies for catalog entity reads. Entity listings without a limit and without an explicit order are also faster on PostgreSQL for large catalogs. Their order stays stable, but may differ from before.
