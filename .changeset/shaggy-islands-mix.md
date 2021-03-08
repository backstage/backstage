---
'@backstage/plugin-kubernetes': minor
'@backstage/plugin-kubernetes-backend': minor
---

Restructure configuration; Add GKE cluster locator

Config migration

1. `kubernetes.clusters` is now at `kubernetes.clusterLocatorMethods[].clusters` when the `clusterLocatorMethod` is of `type: 'config''`
2. `kubernetes.serviceLocatorMethod` is now an object. `multiTenant` is the only valid `type` currently

Old config example:

```yaml
kubernetes:
  serviceLocatorMethod: 'multiTenant'
  clusterLocatorMethods:
    - 'config'
  clusters:
    - url: http://127.0.0.1:9999
      name: minikube
      authProvider: 'serviceAccount'
      serviceAccountToken:
        $env: K8S_MINIKUBE_TOKEN
    - url: http://127.0.0.2:9999
      name: aws-cluster-1
      authProvider: 'aws'
```

New config example:

```yaml
kubernetes:
  serviceLocatorMethod:
    type: 'multiTenant'
  clusterLocatorMethods:
    - type: 'config'
      clusters:
        - url: http://127.0.0.1:9999
          name: minikube
          authProvider: 'serviceAccount'
          serviceAccountToken:
            $env: K8S_MINIKUBE_TOKEN
        - url: http://127.0.0.2:9999
          name: aws-cluster-1
          authProvider: 'aws'
```
