---
'@backstage/integration-aws-node': patch
---

Added an alpha `createAwsCredentialsManagerFromConnection` export that creates an `AwsCredentialsManager` backed by the connections system. Credentials resolve through the `aws` connection type: entries matched by account number or ARN are used as written, the connection-level role settings cover accounts without an entry of their own, and the main account entry acts as the fallback and the source of credentials for role assumption. The existing configuration-based setup is unchanged.
