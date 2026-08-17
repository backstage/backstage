---
'@backstage/plugin-kubernetes-backend': patch
---

Fixed `AwsIamStrategy` to resolve account-specific AWS credentials when an assume role ARN is configured, enabling support for `webIdentityTokenFile` and `accountDefaults` in environments without default AWS credentials.
