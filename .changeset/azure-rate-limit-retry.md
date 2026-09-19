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

A retry waits for as long as Azure DevOps asks for in its `Retry-After` or `X-RateLimit-Delay` response header, falling back to an exponential backoff when neither is present.

Those headers are read off every response, including successful ones, since Azure DevOps reports a delay on requests it merely held back before it starts rejecting them. When one arrives, every request to that host pauses for the period Azure DevOps asked for, because the whole host shares one budget. All of this is off unless you configure it, so existing behavior is unchanged.
