# @backstage/plugin-kubernetes-react

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
