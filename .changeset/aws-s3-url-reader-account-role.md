---
'@backstage/backend-defaults': patch
---

The AWS S3 URL reader no longer assumes the configured `roleArn` a second time when the matching account under `aws.accounts` already provides credentials for that exact role, for example through a web identity token file. Previously the role had to trust itself for this setup to work. The role is still assumed explicitly when the integration sets an `externalId`.
