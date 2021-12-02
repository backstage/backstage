---
'@backstage/plugin-kubernetes': minor
'@backstage/plugin-kubernetes-backend': minor
'@backstage/plugin-kubernetes-common': minor
---

Add pod metrics lookup and display in pod table.

## Backwards incompatible changes

If your Kubernetes distribution does not have the [metrics server](https://github.com/kubernetes-sigs/metrics-server) installed,
you will need to set the `skipMetricsLookup` config flag to `false`.

See the [configuration docs](https://backstage.io/docs/features/kubernetes/configuration) for more details.
