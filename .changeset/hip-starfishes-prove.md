---
'@backstage/backend-defaults': patch
---

Added an implementation for the new `RedactionsService`, exported from the `/redactions` sub-path.

This also moves the reading of config secrets for redactions from the root logger service to the root config service. If you have customized the root config service, be sure to update it to match the new implementation:

```ts
import { createConfigSecretEnumerator } from './createConfigSecretEnumerator';

createServiceFactory({
  service: coreServices.rootConfig,
  deps: {
    redactions: coreServices.redactions,
  },
  async factory({ redactions }) {
    const source = ConfigSources.default({
      argv: options?.argv,
      remote: options?.remote,
      watch: options?.watch,
    });
[
    console.log(`Loading config from ${source}`);

    const config = await ConfigSources.toConfig(source);

    const secretEnumerator = await createConfigSecretEnumerator();
    redactions.addRedactions(secretEnumerator(config));
    config.subscribe?.(() =>
      redactions.addRedactions(secretEnumerator(config)),
    );

    return config;]
  },
});
```

The `createConfigSecretEnumerator` function is exported by `@backstage/backend-defaults/rootConfig`.
