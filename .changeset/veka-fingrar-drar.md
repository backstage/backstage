---
'@backstage/core-app-api': patch
---

If you'd like to send analytics events to multiple implementations, you may now
do so using the `MultipleAnalyticsApi` implementation provided by this package.

```tsx
import { MultipleAnalyticsApi } from '@backstage/core-app-api';
import {
  analyticsApiRef,
  configApiRef,
  storageApiRef,
  identityApiRef,
} from '@internal/backstage/core-plugin-api';
import { CustomAnalyticsApi } from '@internal/analytics';
import { VendorAnalyticsApi } from '@vendor/analytics';

createApiFactory({
  api: analyticsApiRef,
  deps: { configApi: configApiRef, identityApi: identityApiRef, storageApi: storageApiRef },
  factory: ({ configApi, identityApi, storageApi }) =>
    MultipleAnalyticsApi.fromApis([
      VendorAnalyticsApi.fromConfig(configApi, { identityApi }),
      CustomAnalyticsApi.fromConfig(configApi, { identityApi, storageApi }),
    ]),
}),
```
