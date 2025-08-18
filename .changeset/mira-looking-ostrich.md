---
'@backstage/frontend-plugin-api': patch
---

Plugins should now use the new `AnalyticsImplementationBlueprint` to define and provide concrete analytics implementations. For example:

```ts
import { AnalyticsImplementationBlueprint } from '@backstage/frontend-plugin-api';

const AcmeAnalytics = AnalyticsImplementationBlueprint.make({
  name: 'acme-analytics',
  params: define =>
    define({
      deps: { config: configApiRef },
      factory: ({ config }) => AcmeAnalyticsImpl.fromConfig(config),
    }),
});
```
