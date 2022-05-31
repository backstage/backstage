---
'@backstage/plugin-catalog-backend': patch
---

Provide a new listener `CatalogProcessingErrorListener` for the processing engines to notify the caller if an entity can not be processed. Processing engine
will collect the errors and passes the entity and the results to the given listeners.
