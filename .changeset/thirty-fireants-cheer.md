---
'@backstage/plugin-catalog-react': patch
---

Breaking alpha-API change to entity visibility filter functions to accept a bare entity as their first argument, instead of an object with an entity property.

Functions that accept such filters now also support the string expression form of filters.
