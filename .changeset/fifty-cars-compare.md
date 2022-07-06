---
'@backstage/plugin-kubernetes': minor
'@backstage/plugin-kubernetes-backend': minor
---

Add `localKubectlProxy` cluster locator method to make local development simpler to setup.

Consolidated no-op server side auth decorators.
The following Kubernetes auth decorators are now one class (`ServerSideKubernetesAuthProvider`):

- `AwsKubernetesAuthProvider`
- `AzureKubernetesAuthProvider`
- `ServiceAccountKubernetesAuthProvider`
