---
'@backstage/plugin-search-backend-node': patch
---

Exports `QueryTranslator`, `QueryRequestOptions` and `SearchEngine` types. These new types were extracted from the `@backstage/plugin-search-common` package and the `token` property was deprecated in favor of the a new credentials one.
