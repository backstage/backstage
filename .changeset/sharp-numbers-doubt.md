---
'@backstage/plugin-catalog-react': minor
---

Added EntityOrderFilter to sort entities by different fields/columns. This new filter allows users to specify the order in which entities are displayed in the catalog.

Example usage:

```ts
import {
  EntityOrderFilter,
  useEntityList,
} from '@backstage/plugin-catalog-react';
// ...
const { updateFilters } = useEntityList();

// ...
updateFilters({
  order: new EntityOrderFilter([
    {
      field: 'metadata.name',
      order: 'desc',
    },
  ]),
});
```
