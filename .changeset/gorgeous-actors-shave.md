---
'@backstage/create-app': patch
---

Update import location of catalogEntityCreatePermission.

To apply this change to an existing app, make the following change to `packages/app/src/App.tsx`:

```diff
-import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common';
+import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';
```
