---
'@backstage/plugin-api-docs': patch
---

Migrated entity table cards (`ConsumedApisCard`, `ProvidedApisCard`, `HasApisCard`, `ConsumingComponentsCard`, `ProvidingComponentsCard`) to use BUI when no legacy props are passed. The old `variant`, `columns`, and `tableOptions` props are deprecated but still supported — passing any of them triggers the legacy MUI-based rendering. The new `columnConfig` prop accepts `EntityColumnConfig[]` for BUI-based rendering.
