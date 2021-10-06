---
'@backstage/catalog-client': minor
'@backstage/plugin-catalog': minor
---

Updates the `<EntitySwitch if={asyncMethod}/>` to accept asynchronous `if` functions.

Adds the new `getEntityAncestors` method to `CatalogClient`.

Updates the `<EntityProcessingErrorsPanel />` to make use of the ancestry endpoint to display errors for entities further up the ancestry tree. This makes it easier to discover issues where for example the origin location has been removed or malformed.

`hasCatalogProcessingErrors()` is now changed to be asynchronous so any calls outside the already established entitySwitch need to be awaited.
