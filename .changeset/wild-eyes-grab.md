---
'@backstage/plugin-search-backend-module-elasticsearch': minor
---

**BREAKING**: The ElasticSearch indexer will now delete stale indices matching the indexer's pattern.
The method `getAliases` of `ElasticSearchClientWrapper` has been deprecated and might be removed in future releases.

An indexer using the `some-type-index__*` pattern will remove indices matching this pattern after indexation
to prevent stale indices leading to shards exhaustion.

Before upgrading ensure that the index pattern doesn't match indices that are not managed by Backstage
and thus shouldn't be deleted.

Note: The ElasticSearch indexer already uses wildcards patterns to remove aliases on these indices.
