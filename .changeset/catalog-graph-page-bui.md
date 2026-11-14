---
'@backstage/plugin-catalog-graph': minor
---

The catalog graph page is migrated to Backstage UI. The filter panel now uses Backstage UI form controls, the kinds and relations filters are searchable multi-select dropdowns, and the maximum depth filter applies its value when the field loses focus or Enter is pressed. On the new frontend system the graph now fills the available height below the plugin header, including when there is no root entity.

Theme style overrides for the catalog graph page and its filters, through `PluginCatalogGraphCatalogGraphPage`, `PluginCatalogGraphMaxDepthFilter`, `PluginCatalogGraphSelectedKindsFilter`, `PluginCatalogGraphSelectedRelationsFilter` and `PluginCatalogGraphSwitchFilter`, no longer have an effect.
