---
'@backstage/plugin-catalog': minor
---

Migrated entity table cards (`HasComponentsCard`, `HasResourcesCard`, `HasSubcomponentsCard`, `HasSubdomainsCard`, `HasSystemsCard`, `DependsOnComponentsCard`, `DependsOnResourcesCard`, `DependencyOfComponentsCard`) to use BUI when no legacy props are passed. The old `variant`, `columns`, and `tableOptions` props are deprecated but still supported — passing any of them triggers the legacy MUI-based rendering. The new `columnConfig` prop accepts `EntityColumnConfig[]` for BUI-based rendering.

`RelatedEntitiesCard` is deprecated — use `EntityRelationCard` from `@backstage/plugin-catalog-react/alpha` instead.
