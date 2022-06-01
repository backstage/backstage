# @backstage/plugin-kubernetes-common

## 0.3.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.3-next.0

## 0.3.0-next.0

### Minor Changes

- 4328737af6: Add support to fetch data for Stateful Sets

## 0.2.10

### Patch Changes

- 1ef98cfe48: add Azure Identity auth provider and AKS dashboard formatter
- 447e060872: Add support for 'oidc' as authProvider for kubernetes authentication
  and adds optional 'oidcTokenProvider' config value. This will allow
  users to authenticate to kubernetes cluster using id tokens obtained
  from the configured auth provider in their backstage instance.
- Updated dependencies
  - @backstage/catalog-model@1.0.2

## 0.2.10-next.1

### Patch Changes

- 447e060872: Add support for 'oidc' as authProvider for kubernetes authentication
  and adds optional 'oidcTokenProvider' config value. This will allow
  users to authenticate to kubernetes cluster using id tokens obtained
  from the configured auth provider in their backstage instance.

## 0.2.10-next.0

### Patch Changes

- 1ef98cfe48: add Azure Identity auth provider and AKS dashboard formatter
- Updated dependencies
  - @backstage/catalog-model@1.0.2-next.0

## 0.2.9

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.1

## 0.2.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.1-next.0

## 0.2.8

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.0

## 0.2.7

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.13.0

## 0.2.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.13.0-next.0

## 0.2.6

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.12.0

## 0.2.5

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.11.0

## 0.2.4

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/catalog-model@0.10.1

## 0.2.3

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/catalog-model@0.10.0

## 0.2.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.9.10

## 0.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.9.10-next.0

## 0.2.1

### Patch Changes

- 7ac0bd2c66: implement dashboard link formatter for GKE

## 0.2.0

### Minor Changes

- c010632f88: Add pod metrics lookup and display in pod table.

  ## Backwards incompatible changes

  If your Kubernetes distribution does not have the [metrics server](https://github.com/kubernetes-sigs/metrics-server) installed,
  you will need to set the `skipMetricsLookup` config flag to `false`.

  See the [configuration docs](https://backstage.io/docs/features/kubernetes/configuration) for more details.

## 0.1.7

### Patch Changes

- 59677fadb1: Improvements to API Reference documentation

## 0.1.6

### Patch Changes

- 37dc844728: Include CronJobs and Jobs as default objects returned by the kubernetes backend and add/update relevant types.

## 0.1.5

### Patch Changes

- 193a999a80: Fixed incorrect keyword, repository directory path and entrypoints in `package.json`.
- Updated dependencies
  - @backstage/catalog-model@0.9.4

## 0.1.4

### Patch Changes

- 7a0c334707: Provide access to the Kubernetes dashboard when viewing a specific resource
- Updated dependencies
  - @backstage/catalog-model@0.9.3

## 0.1.3

### Patch Changes

- 7f24f4088: chore(deps): bump `@kubernetes/client-node` from 0.14.3 to 0.15.0

## 0.1.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.9.0

## 0.1.1

### Patch Changes

- Updated dependencies [add62a455]
- Updated dependencies [704875e26]
  - @backstage/catalog-model@0.8.0

## 0.1.0

### Minor Changes

- Adds types to be shared by the backend and the front end.
