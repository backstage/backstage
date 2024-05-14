---
'@backstage/backend-app-api': patch
---

Added support for camel case CSP directives in app-config. For example:

```yaml
backend:
  csp:
    upgradeInsecureRequests: false
```
