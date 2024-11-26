---
'@backstage/backend-defaults': patch
---

Added new rate limit middleware to allow rate limiting requests to the backend

If you are using the `configure` callback of the root HTTP router service and do NOT call `applyDefaults()` inside it, please see [the relevant changes](https://github.com/backstage/backstage/pull/26725/files#diff-86ad1b6a694dd250823aee39d410428dd837c9d9a04ca8c33bd1081fbe3f22af) that were made, to see if you want to apply them as well to your custom configuration.
Rate limiting can be turned on by adding the following configuration to `app-config.yaml`:

```yaml
backend:
  rateLimit:
    window: 6000ms
    incomingRequestLimit: 100
```
