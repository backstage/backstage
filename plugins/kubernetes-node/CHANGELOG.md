# @backstage/plugin-kubernetes-node

## 0.1.0-next.0

### Minor Changes

- cbb0e3c3f4: A new plugin has been introduced to house the extension points for Kubernetes backend plugin; at the moment only the `KubernetesObjectsProviderExtensionPoint` is present. The `kubernetes-backend` plugin was modified to use this new extension point.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.3-next.0
  - @backstage/plugin-kubernetes-common@0.7.0-next.1
  - @backstage/backend-plugin-api@0.6.6-next.2
