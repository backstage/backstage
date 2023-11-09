---
'@backstage/plugin-catalog-graph': minor
---

Add the entire `Entity` to `EntityNodeData` and deprecate `name`, `kind`, `title`, `namespace` and `spec`.

To get the deprecated properties in your custom component you can use:

```typescript
import { DEFAULT_NAMESPACE } from '@backstage/catalog-model';

const {
  kind,
  metadata: { name, namespace = DEFAULT_NAMESPACE, title },
} = entity;
```
