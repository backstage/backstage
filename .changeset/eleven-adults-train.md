---
'@backstage/backend-defaults': patch
'@backstage/integration': patch
---

Add retry mechanism for GitLab requests on HTTP 429 responses

Added a retry mechanism to handle HTTP 429 (rate limiting) responses from GitLab API requests. This enhancement improves the robustness of GitLab integrations by automatically retrying failed requests due to rate limiting.

**Changes include:**

- New `fetchWithRetry` utility function in backend-defaults
- Enhanced GitLab URL reader with retry functionality
- Updated GitLab core integration to use retry mechanisms
- Added helper functions for retry logic in integration package

This change addresses intermittent failures when GitLab APIs return rate limiting responses, making the GitLab integration more reliable in high-traffic scenarios.
