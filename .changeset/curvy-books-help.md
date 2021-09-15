---
'@backstage/backend-common': patch
'@backstage/plugin-catalog-backend': patch
---

Add AWS S3 Discovery Processor. Add readTree() to AwsS3UrlReader. Add ReadableArrayResponse type that implements ReadTreeResponse to use in AwsS3UrlReader's readTree()
