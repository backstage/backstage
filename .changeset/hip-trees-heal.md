---
'@backstage/backend-common': patch
---

Omits the `upgrade-insecure-requests` Content-Security-Policy directive by default, to prevent automatic HTTPS request upgrading for HTTP-deployed Backstage sites.

If you previously disabled this using `false` in your `app-config.yaml`, this line is no longer necessary:

```diff
backend:
  csp:
-    upgrade-insecure-requests: false
```

To keep the existing behavior of `upgrade-insecure-requests` Content-Security-Policy being _enabled_, add the key with an empty array as the value in your `app-config.yaml`:

```diff
backend:
+  csp:
+    upgrade-insecure-requests: []
```

Read more on [upgrade-insecure-requests here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/upgrade-insecure-requests).
