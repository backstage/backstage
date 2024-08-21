---
'@backstage/plugin-search-backend-module-techdocs': patch
'@backstage/plugin-search-backend-module-catalog': patch
'@backstage/plugin-search-backend-module-explore': patch
---

The following collator factories are deprecated, please [migrate](https://backstage.io/docs/backend-system/building-backends/migrating) to the new backend system and follow the instructions below to install collators via module:

- `DefaultCatalogCollatorFactory`: https://github.com/backstage/backstage/blob/nbs10/search-deprecate-create-router/plugins/search-backend-module-catalog/README.md#installation;
- `ToolDocumentCollatorFactory`: https://github.com/backstage/backstage/blob/nbs10/search-deprecate-create-router/plugins/search-backend-module-explore/README.md#installation;
- `DefaultTechDocsCollatorFactory`: https://github.com/backstage/backstage/blob/nbs10/search-deprecate-create-router/plugins/search-backend-module-techdocs/README.md#installation.
