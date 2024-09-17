---
'@backstage/backend-defaults': patch
---

Added new rate limit middleware to allow rate limiting requests to the backend

Rate limiting can be turned on by adding the following configuration to `app-config.yaml`:

```yaml
backend:
  rateLimit:
    enabled: true
    windowMs: 60000
    limit: 100
```
