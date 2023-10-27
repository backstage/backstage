---
'@backstage/plugin-vault-backend': minor
---

Added support for the [new backend system](https://backstage.io/docs/backend-system/).

In your `packages/backend/src/index.ts` make the following changes:

```diff
  import { createBackend } from '@backstage/backend-defaults';
  const backend = createBackend();
  // ... other feature additions
+ backend.add(import('@backstage/plugin-vault-backend');
  backend.start();
```

If you use the new backend system, the token renewal task can be defined via configuration file:

```diff
vault:
  baseUrl: <BASE_URL>
  token: <TOKEN>
  schedule:
+   frequency: ...
+   timeout: ...
+   # Other schedule options, such as scope or initialDelay
```

If the `schedule` is omitted or set to `false` no token renewal task will be scheduled.
If the value of `schedule` is set to `true` the renew will be scheduled hourly (the default).
In other cases (like in the diff above), the defined schedule will be used.

**DEPRECATIONS**: The interface `VaultApi` and the type `VaultSecret` are now deprecated. Import them from `@backstage/plugin-vault-node`.
