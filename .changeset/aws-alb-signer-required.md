---
'@backstage/plugin-auth-backend-module-aws-alb-provider': minor
---

**BREAKING**: The `awsalb` auth provider now requires the `signer` option to be set to the ARN of the ALB that signs the tokens. Configurations that use the provider without a `signer` are rejected at startup, and sign-in attempts are rejected if the token's signer does not match it.
