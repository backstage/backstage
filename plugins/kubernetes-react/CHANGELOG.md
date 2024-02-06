# @backstage/plugin-kubernetes-react

## 0.3.0-next.2

### Patch Changes

- 8fe56a8: Widen `@types/react` dependency range to include version 18.
- Updated dependencies
  - @backstage/core-components@0.14.0-next.1
  - @backstage/core-plugin-api@1.9.0-next.1
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.4-next.1

## 0.3.0-next.1

### Patch Changes

- 3c184af: Extracted common dialog component.
- Updated dependencies
  - @backstage/core-components@0.14.0-next.0
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/core-plugin-api@1.8.3-next.0
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.4-next.1

## 0.3.0-next.0

### Minor Changes

- 0d526c8: **BREAKING** The pod exec terminal is now disabled by default since there are several scenarios where it is known not to work. It can be re-enabled at your own risk by setting the config parameter `kubernetes.podExecTerminal.enabled` to `true`.

### Patch Changes

- 536f67d: Fix broken XtermJS CSS import
- db1054b: Fixed a bug where the logs dialog and any other functionality depending on the proxy endpoint would fail for clusters configured with the OIDC auth provider.
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.7.4-next.0
  - @backstage/core-components@0.13.10
  - @backstage/catalog-model@1.4.3
  - @backstage/core-plugin-api@1.8.2
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.1

### Patch Changes

- d5d2c67: Add `authuser` search parameter to GKE cluster link formatter in k8s plugin

  Thanks to this, people with multiple simultaneously logged-in accounts in their GCP console will automatically view objects with the same email as the one signed in to the Google auth provider in Backstage.

- Updated dependencies
  - @backstage/core-components@0.13.10
  - @backstage/core-plugin-api@1.8.2
  - @backstage/plugin-kubernetes-common@0.7.3
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.1-next.1

### Patch Changes

- d5d2c67: Add `authuser` search parameter to GKE cluster link formatter in k8s plugin

  Thanks to this, people with multiple simultaneously logged-in accounts in their GCP console will automatically view objects with the same email as the one signed in to the Google auth provider in Backstage.

- Updated dependencies
  - @backstage/core-plugin-api@1.8.2-next.0
  - @backstage/core-components@0.13.10-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.3-next.0

## 0.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.10-next.0
  - @backstage/plugin-kubernetes-common@0.7.3-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/core-plugin-api@1.8.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.0

### Minor Changes

- 899d71a: Change `formatClusterLink` to be an API and make it async for further customization possibilities.

  **BREAKING**
  If you have a custom k8s page and used `formatClusterLink` directly, you need to migrate to new `kubernetesClusterLinkFormatterApiRef`

### Patch Changes

- b5ae2e5: Add ID property to the table displaying kubernetes pods to avoid closing the info sidebar when the data reloads and needs to rerender.
- 706fc3a: Updated dependency `@kubernetes/client-node` to `0.20.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.8.1
  - @backstage/core-components@0.13.9
  - @backstage/plugin-kubernetes-common@0.7.2
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.3
  - @backstage/catalog-model@1.4.3
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.2-next.1

## 0.2.0-next.2

### Minor Changes

- 899d71a: Change `formatClusterLink` to be an API and make it async for further customization possibilities.

  **BREAKING**
  If you have a custom k8s page and used `formatClusterLink` directly, you need to migrate to new `kubernetesClusterLinkFormatterApiRef`

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.3
  - @backstage/core-components@0.13.9-next.2
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.2-next.1

## 0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-kubernetes-common@0.7.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.1.2-next.0

### Patch Changes

- b5ae2e5a62: Add ID property to the table displaying kubernetes pods to avoid closing the info sidebar when the data reloads and needs to rerender.
- 706fc3a7e1: Updated dependency `@kubernetes/client-node` to `0.20.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.8.1-next.0
  - @backstage/core-components@0.13.9-next.0
  - @backstage/plugin-kubernetes-common@0.7.2-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.1.1

### Patch Changes

- 0f4cad6da0: Internal refactor to avoid a null pointer problem
- 6c2b872153: Add official support for React 18.
- b52f576f48: Make sure types exported by other `kubernetes` plugins in the past are exported again after the creation
  of the react package.

  Some types have been moved to this new package but the export was missing, so they were not available anymore for developers.

- Updated dependencies
  - @backstage/core-components@0.13.8
  - @backstage/plugin-kubernetes-common@0.7.1
  - @backstage/core-plugin-api@1.8.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.1.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.7.1-next.1
  - @backstage/core-components@0.13.8-next.2

## 0.1.1-next.1

### Patch Changes

- 0f4cad6da0: Internal refactor to avoid a null pointer problem
- b52f576f48: Make sure types exported by other `kubernetes` plugins in the past are exported again after the creation
  of the react package.

  Some types have been moved to this new package but the export was missing, so they were not available anymore for developers.

- Updated dependencies
  - @backstage/core-components@0.13.8-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/core-plugin-api@1.8.0-next.0
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.1-next.0

## 0.1.1-next.0

### Patch Changes

- 6c2b872153: Add official support for React 18.
- Updated dependencies
  - @backstage/core-components@0.13.7-next.0
  - @backstage/core-plugin-api@1.8.0-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.1-next.0

## 0.1.0

### Minor Changes

- 2d8151061c: Refactor Kubernetes plugins in line with ADR 11, no breaking changes yet

### Patch Changes

- 4262e12921: Handle mixed decimals and bigint when calculating k8s resource usage
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- 95518765ee: Add Kubernetes cluster plugin. Viewing Kubernetes clusters as an Admin from Backstage
- 5dac12e435: The kubernetes APIs invokes Authentication Strategies when Backstage-Kubernetes-Authorization-X-X headers are provided, this enable the possibility to invoke strategies that executes additional steps to get a kubernetes token like on pinniped or custom strategies
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/plugin-kubernetes-common@0.7.0
  - @backstage/types@1.1.1

## 0.1.0-next.1

### Patch Changes

- 95518765ee: Add Kubernetes cluster plugin. Viewing Kubernetes clusters as an Admin from Backstage
- 5dac12e435: The kubernetes APIs invokes Authentication Strategies when Backstage-Kubernetes-Authorization-X-X headers are provided, this enable the possibility to invoke strategies that executes additional steps to get a kubernetes token like on pinniped or custom strategies
- Updated dependencies
  - @backstage/core-components@0.13.6-next.2
  - @backstage/core-plugin-api@1.7.0-next.1
  - @backstage/catalog-model@1.4.3-next.0
  - @backstage/errors@1.2.3-next.0
  - @backstage/plugin-kubernetes-common@0.7.0-next.1
  - @backstage/types@1.1.1

## 0.1.0-next.0

### Minor Changes

- 2d8151061c: Refactor Kubernetes plugins in line with ADR 11, no breaking changes yet

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.6-next.1
  - @backstage/plugin-kubernetes-common@0.7.0-next.0
  - @backstage/core-plugin-api@1.7.0-next.0
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/types@1.1.1
