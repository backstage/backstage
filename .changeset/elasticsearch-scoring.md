---
'@backstage/plugin-search-backend-module-elasticsearch': minor
---

Added opt-in search result scoring for the Elasticsearch search engine. When enabled, results are ranked using configurable per-field weights, per-document-type scoring profiles, and boosts for exact, phrase, and fuzzy matches. Fuzzy matching mechanics continue to be controlled through `search.elasticsearch.queryOptions`.
