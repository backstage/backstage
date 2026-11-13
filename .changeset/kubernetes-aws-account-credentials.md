---
'@backstage/plugin-kubernetes-backend': patch
'@backstage/plugin-kubernetes-common': patch
---

Allow AWS Kubernetes clusters to select credentials from a configured AWS account without assuming another role. Set `kubernetes.io/aws-account-id` in the cluster's auth metadata to use that account's credentials directly, including credentials obtained through web identity federation.
