# Dice roller

An app to roll dice (it doesn't actually do that).

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

Update `app-config.yaml` as follows.

```yaml
---
kubernetes:
  clusterLocatorMethod: 'configMultiTenant'
  clusters:
    - url: <KUBERNETES MASTER BASE URL FROM STEP 2>
      name: minikube
      serviceAccountToken: <TOKEN FROM STEP 4>
```

### Getting the service account token

```
kubectl get secret DICE_ROLLER_TOKEN_NAME -o=json | jq -r '.data["token"]' | base64 --decode | pbcopy
```

Paste into `app-config.yaml` `kubernetes.clusters[].serviceAccountToken`
