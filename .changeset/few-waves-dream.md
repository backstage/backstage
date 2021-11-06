---
'@backstage/backend-common': patch
---

AWSS3UrlReader now throws a `NotModifiedError` (exported from @backstage/backend-common) when s3 returns a 304 response.
