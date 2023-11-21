---
'@backstage/plugin-kubernetes-node': minor
'@backstage/plugin-kubernetes-backend': patch
---

The `kubernetes-node` plugin has been modified to house a new extension points for Kubernetes backend plugin; `KubernetesClusterSupplierExtensionPoint` is introduced . The `kubernetes-backend` plugin was modified to use this new extension point.
