---
'@backstage/plugin-search-backend-module-elasticsearch': patch
---

Fixed Elasticsearch translator to set `minimum_should_match: 1` on the generated bool query, so that search filters narrow down term results instead of making the term optional and returning every document matching the filter.
