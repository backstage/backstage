---
'@backstage/integration-aws-node': patch
---

Fixed bug in DefaultAwsCredentialsManager where aws.mainAccount.region has no effect on the STS region used for account ID lookup during credential provider lookup when falling back to the main account, and it does not default to us-east-1
