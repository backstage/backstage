---
'@backstage/plugin-catalog-unprocessed-entities-common': patch
'@backstage/plugin-catalog-unprocessed-entities': patch
---

Moved types, API and client to the common package, allowing both frontend and
backend plugins to use the `CatalogUnprocessedEntitiesClient`.

The following types, clients and interfaces have been deprecated and should be
imported from the `@backstage/plugin-catalog-unprocessed-entities-common` instead:
`CatalogUnprocessedEntitiesApi`, `CatalogUnprocessedEntitiesApiResponse`, `UnprocessedEntity`,
`UnprocessedEntityCache`, `UnprocessedEntityError`, `CatalogUnprocessedEntitiesClient`.

All those types, clients and interfaces are re-exported temporarily in the
`@backstage/plugin-catalog-unprocessed-entities` package until cleaned up.
