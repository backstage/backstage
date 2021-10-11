---
'@backstage/plugin-auth-backend': patch
---

AWS-ALB: update provider to the latest changes described [here](https://backstage.io/docs/auth/identity-resolver).

This removes the `ExperimentalIdentityResolver` type in favor of `SignInResolver` and `AuthHandler`.
The AWS ALB provider can now be configured in the same way as the Google provider in the example.
