---
'@backstage/plugin-catalog-react': minor
'@backstage/create-app': patch
'@backstage/plugin-catalog': patch
---

The EntitySwitch component and its associated helpers are marked deprecated inside plugin-catalog, and added to plugin-catalog-react instead. There is no change in functionality, just the location.

Any imports of EntitySwitch or its helpers should update the source plugin.

For example:

```diff
import {
  CatalogEntityPage,
  CatalogIndexPage,
  EntityAboutCard,
  EntityLayout,
- EntitySwitch,
- isComponentType,
} from '@backstage/plugin-catalog';
+ import { EntitySwitch, isComponentType } from '@backstage/plugin-catalog-react';
```
