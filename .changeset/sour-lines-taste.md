---
'@backstage/backend-defaults': minor
---

**BREAKING** The correct configuration options for Valkey are now being used.

These changes are **required** to `app-config.yaml`:

```diff
backend:
  cache:
    valkey:
      client:
-       namespace: 'my-app'
-       keyPrefixSeparator: ':'
+       keyPrefix: 'my-app:'
-       clearBatchSize: 1000
-       useUnlink: false
```

In comparison to Redis, Valkey requires the full `keyPrefix` including the separator to be specified instead of separate `namespace` and `keyPrefixSeparator` options. Also, Valkey does not support the `clearBatchSize` and `useUnlink` options.
