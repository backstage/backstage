---
'@backstage/plugin-techdocs-node': patch
---

Upgrade to AWS SDK for Javascript v3

Techdocs support for AWS S3 now requires defining the AWS region to connect to.
If `techdocs.publisher.awsS3.region` is missing from the config, the AWS environment variable `AWS_REGION` will be used.
