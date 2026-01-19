---
'@backstage/plugin-techdocs-node': minor
---

**BREAKING:** It's now possible to use the credentials from the `integrations.awsS3` config to authenticate with AWS S3. The new priority is:

1. `aws.accounts`
2. `techdocs.publisher.awsS3.credentials`
3. `integrations.awsS3`
4. Default credential chain

In case of multiple `integrations.awsS3` are present, the target integration is determined by the `accessKeyId` in `techdocs.publisher.awsS3.credentials` if provided. Otherwise, the default credential chain is used.

This means that depending on your setup, this feature may break your existing setup.
In general:

- if you are configuring `aws.accounts`, no action is required
- if you are configuring `techdocs.publisher.awsS3.credentials`, no action is required
- if you are configuring multiple integrations under `integrations.awsS3`, no action is required
- if you are configuring a single integration under `integrations.awsS3`, make sure that the integration has access to the bucket you are using for TechDocs
