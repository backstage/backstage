---
'@backstage/backend-plugin-api': minor
---

The `createServiceRef` function now accepts a new boolean `multiple` option. The `multiple` option defaults to `false` and when set to `true`, it enables that multiple implementation are installed for the created service ref.

We're looking for ways to make it possible to augment services without the need to replace the entire service.

Typical example of that being the ability to install support for additional targets for the `UrlReader` service without replacing the service itself. This achieves that by allowing us to define services that can have multiple simultaneous implementation, allowing the `UrlReader` implementation to depend on such a service to collect all possible implementation of support for external targets:

```diff
// @backstage/backend-defaults

+ export const urlReaderFactoriesServiceRef = createServiceRef<ReaderFactory>({
+   id: 'core.urlReader.factories',
+   scope: 'plugin',
+   multiton: true,
+ });

...

export const urlReaderServiceFactory = createServiceFactory({
  service: coreServices.urlReader,
  deps: {
    config: coreServices.rootConfig,
    logger: coreServices.logger,
+   factories: urlReaderFactoriesServiceRef,
  },
-  async factory({ config, logger }) {
+  async factory({ config, logger, factories }) {
    return UrlReaders.default({
      config,
      logger,
+     factories,
    });
  },
});
```

With that, you can then add more custom `UrlReader` factories by installing more implementations of the `urlReaderFactoriesServiceRef` in your backend instance. Something like:

```ts
// packages/backend/index.ts
import { createServiceFactory } from '@backstage/backend-plugin-api';
import { urlReaderFactoriesServiceRef } from '@backstage/backend-defaults';
...

backend.add(createServiceFactory({
  service: urlReaderFactoriesServiceRef,
  deps: {},
  async factory() {
    return CustomUrlReader.factory;
  },
}));

...

```
