---
'@backstage/plugin-search-backend-module-elasticsearch': minor
---

**BREAKING** The ElasticSearch indexer will now delete stale indices matching the indexer's pattern.

An indexer using the `some-type-index__*` pattern will remove indices matching this pattern after indexation
to prevent stale indices leading to shards exhaustion.

Note: The ElasticSearch indexer already uses wildcards patterns to remove aliases on these indices.
