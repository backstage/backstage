---
'@backstage/plugin-kubernetes-backend': minor
---

Update `aws-sdk` client from v2 to v3.

**BREAKING**: The `AwsIamKubernetesAuthTranslator` class no longer exposes the following methods `awsGetCredentials`, `getBearerToken`, `getCredentials` and `validCredentials`. There is no replacement for these methods.
