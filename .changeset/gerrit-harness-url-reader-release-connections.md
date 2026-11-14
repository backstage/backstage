---
'@backstage/backend-defaults': patch
---

Fixed a connection and memory leak in the Gerrit and Harness URL readers, where every failed request with a large error response body left its connection open indefinitely.
