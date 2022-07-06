# Dice roller

This can be used to run the kubernetes plugin locally against a mock service.

# Viewing in local Kind running Backstage locally

## Prerequisites

- [kubectl installed](https://kubernetes.io/docs/tasks/tools/#kubectl)
- [Kind installed](https://kind.sigs.k8s.io/docs/user/quick-start/)
- Backstage locally built and ready to run

## Steps

1. Start kind
2. Apply manifests `kubectl apply -f plugins/kubernetes-backend/examples/dice-roller/dice-roller-manifests.yaml`
3. Run `kubectl proxy`
4. In separate terminal windows start Backstage UI and backend
5. Register a test component ([example](https://github.com/mclarke47/dice-roller/blob/master/catalog-info.yaml))
6. Visit [kubernetes plugin page](http://localhost:3000/catalog/default/component/dice-roller/kubernetes)

### Example `app-config.local.yaml`

```yaml
kubernetes:
  serviceLocatorMethod:
    type: 'multiTenant'
  clusterLocatorMethods:
    - type: 'localKubectlProxy'

catalog:
  locations:
    - type: url
      target: https://github.com/mclarke47/dice-roller/blob/master/catalog-info.yaml
```
