---
'@backstage/plugin-catalog-backend': major
---

**BREAKING**: Removed all deprecated exports, and removed support for the old backend system.

It also removes the `CodeOwnersProcessor` from the default set of processors, because it is expensive to run and has vague semantics. You need to update your backend to add it to the `catalogProcessingExtensionPoint` if you wish to continue using it.

The following removed exports are available from `@backstage/plugin-catalog-node`:

- `locationSpecToMetadataName`
- `locationSpecToLocationEntity`
- `processingResult`
- `EntitiesSearchFilter`
- `EntityFilter`
- `DeferredEntity`
- `EntityRelationSpec`
- `CatalogProcessor`
- `CatalogProcessorParser`
- `CatalogProcessorCache`
- `CatalogProcessorEmit`
- `CatalogProcessorLocationResult`
- `CatalogProcessorEntityResult`
- `CatalogProcessorRelationResult`
- `CatalogProcessorErrorResult`
- `CatalogProcessorRefreshKeysResult`
- `CatalogProcessorResult`
- `EntityProvider`
- `EntityProviderConnection`
- `EntityProviderMutation`
- `AnalyzeOptions`
- `LocationAnalyzer`
- `ScmLocationAnalyzer`
- `PlaceholderResolver`
- `PlaceholderResolverParams`
- `PlaceholderResolverRead`
- `PlaceholderResolverResolveUrl`
- `parseEntityYaml`

The following removed exports are available from `@backstage/plugin-catalog-common`:

- `LocationSpec`
- `AnalyzeLocationRequest`
- `AnalyzeLocationResponse`
- `AnalyzeLocationExistingEntity`
- `AnalyzeLocationGenerateEntity`
- `AnalyzeLocationEntityField`

The following removed exports are instead implemented in the new backend system by `@backstage/plugin-search-backend-module-catalog`:

- `defaultCatalogCollatorEntityTransformer`
- `CatalogCollatorEntityTransformer`
- `DefaultCatalogCollator`

The following exports are removed without a direct replacement:

- `DefaultCatalogCollatorFactory`
- `DefaultCatalogCollatorFactoryOptions`
- `LocationEntityProcessor`
- `LocationEntityProcessorOptions`
- `CatalogBuilder`
- `CatalogEnvironment`
- `CatalogPermissionRuleInput`
- `CatalogProcessingEngine`
- `createRandomProcessingInterval`
- `ProcessingIntervalFunction`
