---
'@backstage/plugin-api-docs': minor
---

**BREAKING**: Migrated entity table cards (`ConsumedApisCard`, `ProvidedApisCard`, `HasApisCard`, `ConsumingComponentsCard`, `ProvidingComponentsCard`) from MUI/InfoCard to BUI using `EntityRelationCard` from `@backstage/plugin-catalog-react`. The `variant` and `tableOptions` props have been removed, and `columns` has been replaced with `columnConfig` accepting BUI `ColumnConfig<EntityRow>[]`.

**Migration:**

```diff
- import { ConsumedApisCard } from '@backstage/plugin-api-docs';
- <ConsumedApisCard variant="gridItem" columns={myColumns} />
+ import { ConsumedApisCard } from '@backstage/plugin-api-docs';
+ <ConsumedApisCard columnConfig={myColumnConfig} />
```
