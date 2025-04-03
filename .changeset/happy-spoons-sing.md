---
'@backstage/plugin-catalog-react': minor
'@backstage/plugin-catalog': minor
---

**BREAKING**: `CatalogFilterBlueprint`, used in the new frontend system, is now exported under plugin-catalog-react instead of plugin-catalog.

```diff
+ import { CatalogFilterBlueprint } from '@backstage/plugin-catalog-react/alpha';
- import { CatalogFilterBlueprint } from '@backstage/plugin-catalog/alpha';
```
