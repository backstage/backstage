---
'@backstage/plugin-search-backend-node': minor
---

Build search queries using the query builder in `LunrSearchEngine`. This removes
the support for specifying custom queries with the lunr query syntax, but makes
sure that inputs are properly escaped. Supporting the full lunr syntax is still
possible by setting a custom query translator.
The interface of `LunrSearchEngine.setTranslator()` is changed to support
building lunr queries.
