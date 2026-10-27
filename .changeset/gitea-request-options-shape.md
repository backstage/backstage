---
'@backstage/integration': patch
---

Fixed the Gitea integration so that request options for unauthenticated requests are returned in the same shape as authenticated ones, avoiding an inconsistency when no credentials are configured.
