---
'@backstage/plugin-adr': minor
'@backstage/plugin-adr-backend': minor
'@backstage/plugin-adr-common': minor
---

Display associated entity as a chip in `AdrSearchResultListItem`

BREAKING: `AdrDocument` now includes a `entityRef` property, if you have a custom `AdrParser` you will have to supply this property in your returned documents
