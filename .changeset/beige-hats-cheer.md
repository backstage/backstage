---
'@backstage/plugin-catalog-backend': patch
---

Add deprecations for symbols that were moved to `@backstage/plugin-catalog-node` a long time ago:

- `CatalogProcessor`
- `CatalogProcessorCache`
- `CatalogProcessorEmit`
- `CatalogProcessorEntityResult`
- `CatalogProcessorErrorResult`
- `CatalogProcessorLocationResult`
- `CatalogProcessorParser`
- `CatalogProcessorRefreshKeysResult`
- `CatalogProcessorRelationResult`
- `CatalogProcessorResult`
- `DeferredEntity`
- `EntityProvider`
- `EntityProviderConnection`
- `EntityProviderMutation`
- `EntityRelationSpec`
- `processingResult`

Also moved over and deprecated the following symbols:

- `locationSpecToLocationEntity`
- `locationSpecToMetadataName`
