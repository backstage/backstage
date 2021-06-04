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
