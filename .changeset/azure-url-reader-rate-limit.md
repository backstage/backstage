---
'@backstage/backend-defaults': patch
---

Reads from Azure DevOps now use the `retry` settings of the matching Azure integration, so a catalog that shares one identity across many repositories can back off instead of turning a throttled read into a processing error.

Failures caused by throttling are also now reported as such. Azure DevOps answers a throttled request with a sign-in page or a `429` rather than a clear error, which previously surfaced as an unexplained authentication failure.
