---
'@backstage/plugin-kubernetes-node': patch
'@backstage/plugin-kubernetes-backend': patch
---

The `kubernetes-node` plugin has been modified to house a new extension points for Kubernetes backend plugin;
`KubernetesClusterSupplierExtensionPoint` is introduced .
`kubernetesAuthStrategyExtensionPoint` is introduced .
`kubernetesFetcherExtensionPoint` is introduced .
`kubernetesServiceLocatorExtensionPoint` is introduced .

The `kubernetes-backend` plugin was modified to use this new extension point.
