---
'@backstage/plugin-catalog-backend-module-github': patch
---

Fixed bug in queryWithPaging that caused secondary rate limit errors in GitHub with organizations having more than 1000 repositories. This change makes one request per second to avoid concurrency issues.
