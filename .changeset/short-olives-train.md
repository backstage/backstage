---
'@backstage/plugin-kubernetes-backend': patch
'@backstage/plugin-kubernetes-common': patch
---

Refactor `KubernetesObjectsProvider` with new methods, `KubernetesServiceLocator` now takes an `Entity` instead of `serviceId`
