---
'@backstage/integration-aws-node': patch
---

Credential providers returned by `DefaultAwsCredentialsManager` now include a `roleArn` field with the ARN of the IAM role the credentials are for, when the account is configured to assume a role.
