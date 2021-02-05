# Dice roller

This can be used to run the kubernetes plugin locally against a mock service.

# Viewing in local Minikube running Backstage locally

## Prerequisites

- kubectl installed
- Minikube installed, with the following addons
  - metrics-server
  - ingress
- jq installed
- Backstage locally built and ready to run

## Steps

1. Start minikube
2. Get the Kubernetes master base url `kubectl cluster-info`
3. Apply manifests `kubectl apply -f dice-roller-manifests.yaml`
4. Get service account token (see below)
5. Start Backstage UI and backend
6. Register existing component in Backstage
   - https://github.com/mclarke47/dice-roller/blob/master/catalog-info.yaml

Add or update `app-config.local.yaml` with the following:

```yaml
kubernetes:
  serviceLocatorMethod: 'multiTenant'
  clusterLocatorMethods:
    - 'config'
  clusters:
    - url: <KUBERNETES MASTER BASE URL FROM STEP 2>
      name: minikube
      serviceAccountToken: <TOKEN FROM STEP 4>
      authProvider: 'serviceAccount'
```

### Getting the service account token

Mac copy to clipboard:

```
kubectl get secret $(kubectl get sa dice-roller -o=json | jq -r '.secrets[0].name') -o=json | jq -r '.data["token"]' | base64 --decode | pbcopy
```

Paste into `app-config.local.yaml` `kubernetes.clusters[0].serviceAccountToken`
