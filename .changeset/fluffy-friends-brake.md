---
'@backstage/integration': patch
---

Detect whether the GitLab API is returning an HTTP-429 response, indicating that the request has been rate-limited. Throw a specific error in this case.
