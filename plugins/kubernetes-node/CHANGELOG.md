# @backstage/plugin-kubernetes-node

## 0.1.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.4-next.1

## 0.1.4-next.1

### Patch Changes

- cceed8a: Introduced `PinnipedHelper` class to enable authentication to Kubernetes clusters through Pinniped
- Updated dependencies
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.4-next.1

## 0.1.4-next.0

### Patch Changes

- a775596: Enabled a way to include custom auth metadata info on the clusters endpoint. If you want to implement a Kubernetes auth strategy which requires surfacing custom auth metadata to the frontend, use the new presentAuthMetadata method on the AuthenticationStrategy interface.
- f180cba: Enabling authentication to kubernetes clusters with mTLS x509 client certs
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.7.4-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/types@1.1.1

## 0.1.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9
  - @backstage/plugin-kubernetes-common@0.7.3
  - @backstage/catalog-model@1.4.3
  - @backstage/types@1.1.1

## 0.1.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2

## 0.1.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.3-next.0

## 0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.7.3-next.0
  - @backstage/backend-plugin-api@0.6.9-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/types@1.1.1

## 0.1.2

### Patch Changes

- 6010564: The `kubernetes-node` plugin has been modified to house a new extension points for Kubernetes backend plugin;
  `KubernetesClusterSupplierExtensionPoint` is introduced .
  `kubernetesAuthStrategyExtensionPoint` is introduced .
  `kubernetesFetcherExtensionPoint` is introduced .
  `kubernetesServiceLocatorExtensionPoint` is introduced .

  The `kubernetes-backend` plugin was modified to use this new extension point.

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.7.2
  - @backstage/backend-plugin-api@0.6.8
  - @backstage/catalog-model@1.4.3
  - @backstage/types@1.1.1

## 0.1.2-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.8-next.3
  - @backstage/catalog-model@1.4.3
  - @backstage/plugin-kubernetes-common@0.7.2-next.1

## 0.1.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.8-next.2
  - @backstage/catalog-model@1.4.3
  - @backstage/plugin-kubernetes-common@0.7.2-next.1

## 0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.7.2-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/catalog-model@1.4.3

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.7.2-next.0
  - @backstage/backend-plugin-api@0.6.8-next.0
  - @backstage/catalog-model@1.4.3

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.7.1
  - @backstage/backend-plugin-api@0.6.7
  - @backstage/catalog-model@1.4.3

## 0.1.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.7.1-next.1
  - @backstage/backend-plugin-api@0.6.7-next.2

## 0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/plugin-kubernetes-common@0.7.1-next.0

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/plugin-kubernetes-common@0.7.1-next.0

## 0.1.0

### Minor Changes

- cbb0e3c3f4: A new plugin has been introduced to house the extension points for Kubernetes backend plugin; at the moment only the `KubernetesObjectsProviderExtensionPoint` is present. The `kubernetes-backend` plugin was modified to use this new extension point.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.3
  - @backstage/plugin-kubernetes-common@0.7.0
  - @backstage/backend-plugin-api@0.6.6

## 0.1.0-next.0

### Minor Changes

- cbb0e3c3f4: A new plugin has been introduced to house the extension points for Kubernetes backend plugin; at the moment only the `KubernetesObjectsProviderExtensionPoint` is present. The `kubernetes-backend` plugin was modified to use this new extension point.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.3-next.0
  - @backstage/plugin-kubernetes-common@0.7.0-next.1
  - @backstage/backend-plugin-api@0.6.6-next.2
