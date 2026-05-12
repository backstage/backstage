---
'@backstage/integration-aws-node': minor
---

Added `webIdentityTokenFile` to `AwsIntegrationAccountConfig` and
`AwsIntegrationDefaultAccountConfig`. When set along with a `roleName`,
`DefaultAwsCredentialsManager` retrieves credentials by calling
`AssumeRoleWithWebIdentity` (via `fromTokenFile`) using the file's
contents as the web identity token. The file is re-read on each
credential refresh.

The validator rejects combining `webIdentityTokenFile` with
`accessKeyId`/`secretAccessKey`, `profile`, or `externalId`, and
rejects setting it without a `roleName`.
