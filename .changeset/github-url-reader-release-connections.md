---
'@backstage/backend-defaults': patch
---

Fixed a connection and memory leak in the GitHub URL reader, where every failed request with a large error response body, such as the error pages served during a GitHub Enterprise outage, left its connection open indefinitely.
