---
'@backstage/backend-common': patch
---

Omit the `upgrade-insecure-requests` Content-Security-Policy directive by default, to prevent automatic HTTPS request upgrading for HTTP-deployed Backstage sites.

If you previously disable this using `false` in your `app-config.yaml`, this line is no longer necessary:

```diff
backend:
  csp:
-    upgrade-insecure-requests: false
```

But if you want to keep the existing behavior of `upgrade-insecure-requests` Content-Security-Policy being enabled, make the following change in your `app-config.yaml`. You can read more the CSP here https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/upgrade-insecure-requests

```diff
backend:
+  csp:
+    upgrade-insecure-requests: []
```
