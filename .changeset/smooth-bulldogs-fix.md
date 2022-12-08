---
'@backstage/plugin-techdocs-backend': minor
---

Added a new optional `accountId` to the configuration options of the AWS S3 publisher. Configuring this option will source credentials for the `accountId` in the `aws` app config section. See https://github.com/backstage/backstage/blob/master/packages/integration-aws-node/README.md for more details.
