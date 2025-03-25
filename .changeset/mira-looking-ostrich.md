---
'@backstage/frontend-plugin-api': patch
---

Plugins should now use the new `AnalyticsBlueprint` to define and provide concrete analytics implementations. For example:

```ts
import { AnalyticsBlueprint } from '@backstage/frontend-plugin-api';

const AcmeAnalytics = AnalyticsBlueprint.make({
  name: 'acme-analytics',
  params: define =>
    define({
      deps: { config: configApiRef },
      factory: ({ config }) => AcmeAnalyticsImpl.fromConfig(config),
    }),
});
```
