---
'@backstage/backend-defaults': patch
'@backstage/integration': minor
'@backstage/plugin-catalog-backend-module-gitlab': patch
---

Add configurable throttling and retry mechanism for GitLab integrations

Enhanced GitLab integrations with configurable rate limiting and retry mechanisms to improve robustness when interacting with GitLab APIs. This feature allows administrators to configure appropriate throttling and retry behavior based on their GitLab instance limitations and usage patterns.

**New configuration options:**

- `maxRetries`: Maximum number of retries for failed requests (default: 0, disabled)
- `retryStatusCodes`: HTTP status codes that trigger retries (default: [], empty)
- `limitPerMinute`: Rate limit for requests per minute (default: -1, disabled)

```yaml
integrations:
  gitlab:
    - host: gitlab.com
      token: ${GITLAB_TOKEN}
      # Maximum number of retries for failed requests (default: 0, disabled)
      maxRetries: 3
      # HTTP status codes that trigger retries (default: empty)
      retryStatusCodes: [429]
      # Rate limit for requests per minute (default: -1, disabled)
      limitPerMinute: 100
```

**Changes include:**

- **GitLabIntegrationConfig**: Added new throttling configuration fields with TypeScript definitions
- **GitLabIntegration**: Refactored with modular fetch strategy creation supporting plain fetch, retry logic, and throttling
- **Configuration parsing**: Enhanced `readGitLabIntegrationConfig` with new throttling options and validation
- **OpenTelemetry integration**: Added metrics for monitoring throttling behavior and 429 responses
- **GitLab URL reader**: Updated to extract `signal` parameter for proper request cancellation support
- **Comprehensive testing**: Added extensive test coverage for all fetch strategies and configuration combinations

**Technical implementation:**

- Uses `p-throttle` library for rate limiting with configurable requests per minute
- Implements exponential backoff retry logic with respect for `Retry-After` headers
- Modular fetch strategy allows combining throttling and retry mechanisms
- Maintains backward compatibility with disabled defaults (no throttling/retries unless explicitly configured)

This enhancement addresses intermittent failures when GitLab APIs return rate limiting responses and allows fine-tuned control over API request patterns for different GitLab deployment scenarios.
