---
'@backstage/integration': minor
---

Added an optional `retry` section to Azure integrations, so that requests to Azure DevOps can wait and try again when the service reports that it is throttling you, instead of failing right away.

```yaml
integrations:
  azure:
    - host: dev.azure.com
      retry:
        maxRetries: 3
        retryStatusCodes: [429, 503]
        maxApiRequestsPerMinute: 200
```

A retry waits for as long as Azure DevOps asks for in its `Retry-After` or `X-RateLimit-Delay` response header, falling back to an exponential backoff when neither is present. Retries are off unless you configure them, so existing behavior is unchanged.
