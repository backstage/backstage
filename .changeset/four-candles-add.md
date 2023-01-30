---
'@backstage/plugin-tech-insights-backend': patch
'@backstage/plugin-tech-insights-common': patch
'@backstage/plugin-tech-insights-node': minor
'@backstage/plugin-tech-insights': patch
---

TechInsightsApi interface now has getFactSchemas() method.
TechInsightsClient now implements method getFactSchemas().

**BREAKING** FactSchema type moved from @backstage/plugin-tech-insights-node into @backstage/plugin-tech-insights-common

These changes are **required** if you were importing this type directly.

```diff
- import { FactSchema } from '@backstage/plugin-tech-insights-node';
+ import { FactSchema } from '@backstage/plugin-tech-insights-common';
```
