---
'@backstage/plugin-catalog-backend': minor
---

This continues the deprecation of classes used by the legacy catalog engine. New deprecations can be viewed in this [PR](https://github.com/backstage/backstage/pull/7500) or in the API reference documentation.

The `batchAddOrUpdateEntities` method of the `EntitiesCatalog` interface has been marked as optional and is being deprecated. It is still implemented and required to be implemented by the legacy catalog classes, but was never implemented in the new catalog.

This change is only relevant if you are consuming the `EntitiesCatalog` interface directly, in which case you will get a type error that you need to resolve. It can otherwise be ignored.
