---
'@backstage/plugin-techdocs-node': patch
---

Fix AWS S3 404 NotFound error

When reading an object from the S3 bucket through a stream, the aws-sdk getObject() API may throw a 404 NotFound Error with no error message or, in fact, any sort of HTTP-layer error responses. These fail the @backstage/error's assertError() checks, so they must be wrapped. The test for this case was also updated to match the wrapped error message.
