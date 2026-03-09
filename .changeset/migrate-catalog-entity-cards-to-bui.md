---
'@backstage/plugin-catalog': major
---

**BREAKING**: Migrated entity table cards (`HasComponentsCard`, `HasResourcesCard`, `HasSubcomponentsCard`, `HasSubdomainsCard`, `HasSystemsCard`, `DependsOnComponentsCard`, `DependsOnResourcesCard`, `DependencyOfComponentsCard`) from MUI/InfoCard to BUI. The `variant` and `tableOptions` props have been removed, and `columns` has been replaced with `columnConfig` accepting BUI `ColumnConfig<EntityRow>[]` instead of core-components `TableColumn`.

`RelatedEntitiesCard` is deprecated — use `EntityRelationCard` from `@backstage/plugin-catalog-react` instead.

**Migration:**

```diff
- import { HasComponentsCard } from '@backstage/plugin-catalog';
- <HasComponentsCard variant="gridItem" columns={myColumns} tableOptions={opts} />
+ import { HasComponentsCard } from '@backstage/plugin-catalog';
+ <HasComponentsCard columnConfig={myColumnConfig} />
```
