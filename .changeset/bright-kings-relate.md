---
'@backstage/plugin-catalog': major
'@backstage/plugin-catalog-react': minor
---

**BREAKING** The EntitySwitch component and its associated helpers move from plugin-catalog to plugin-catalog-react.
There is no associated change in functionality, just the location.

Any imports of EntitySwitch or its helpers must update the source plugin.

For example:

```diff
import {
  CatalogEntityPage,
  CatalogIndexPage,
  EntityAboutCard,
  EntityLayout,
- EntitySwitch,
- isisComponentType,
} from '@backstage/plugin-catalog';
+ import { EntitySwitch, isComponentType } from '@backstage/plugin-catalog-react';
```
