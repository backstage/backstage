---
'@backstage/plugin-kubernetes-node': minor
'@backstage/plugin-kubernetes-backend': patch
---

A new Package is introduced to house the backend plugin's extension points for Kubernetes plugin, at the moment only the KubernetesObjectsProviderExtensionPoint is present. The Kubernetes-backed package was modified to use this new extension point
