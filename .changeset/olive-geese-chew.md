---
'@backstage/backend-common': patch
'@backstage/integration': patch
---

Support external ID when assuming roles in S3 integration

In order to assume a role created by a 3rd party as external
ID is needed. This change adds an optional field to the s3
integration configuration and consumes that in the AwsS3UrlReader.
