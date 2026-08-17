---
'@backstage/integration-aws-node': patch
---

Added an alpha `createAwsCredentialsManagerFromConnection` export that creates an `AwsCredentialsManager` backed by the connections system, allowing AWS credential resolution through the new `aws` connection type. The existing configuration-based setup is unchanged.
