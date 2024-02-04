---
'@backstage/plugin-tech-insights-backend': patch
'@backstage/plugin-tech-insights-node': patch
---

Move `FactRetrieverRegistry` and `PersistenceContext` to `@backstage/plugin-tech-insights-node`.

Original exports are marked as deprecated and re-export the moved types.

Please replace uses like

```ts
import {
  FactRetrieverRegistry,
  PersistenceContext,
} from '@backstage/plugin-tech-insights-backend';
```

with

```ts
import {
  FactRetrieverRegistry,
  PersistenceContext,
} from '@backstage/plugin-tech-insights-node';
```
