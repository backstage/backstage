---
'@backstage/plugin-kubernetes-node': minor
'@backstage/plugin-kubernetes-backend': patch
---

A new plugin has been introduced to house the extension points for Kubernetes backend plugin; at the moment only the `KubernetesObjectsProviderExtensionPoint` is present. The `kubernetes-backend` plugin was modified to use this new extension point.
