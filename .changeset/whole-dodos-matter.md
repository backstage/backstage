---
'@backstage/plugin-techdocs-node': minor
---

It's now possible to use the credentials from the `integrations.awsS3` config to authenticate with AWS S3. The new priority is:

1. `aws.accounts`
2. `techdocs.publisher.awsS3.credentials`
3. `integrations.awsS3`
4. Default credential chain

In case of multiple `integrations.awsS3` are present, the target integration is determined by the `accessKeyId` in `techdocs.publisher.awsS3.credentials` if provided. Otherwise, the default credential chain is used.
