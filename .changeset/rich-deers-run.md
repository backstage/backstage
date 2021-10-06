---
'@backstage/backend-common': patch
---

Add glob patterns support to config CORS options. It's possible to send patterns like:

```yaml
backend:
  cors:
    origin:
      [
        https://*.my-domain.com,
        http://localhost:700?,
        'https://sub-domain-+([0-9]).my-domain.com',
      ]
```
