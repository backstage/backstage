# @backstage/plugin-kubernetes

## 0.6.6

### Patch Changes

- 4328737af6: Add support to fetch data for Stateful Sets and display an accordion in the same way as with Deployments
- b9b8bbc7d9: show request/limit CPU and Memory on the UI
- 5553f09e80: ability to configure refresh interval on Kubernetes tab
- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- 81304e3e91: Fix for HPA matching when deploying same HPA in multiple namespaces
- Updated dependencies
  - @backstage/plugin-catalog-react@1.1.1
  - @backstage/core-components@0.9.5
  - @backstage/plugin-kubernetes-common@0.3.0
  - @backstage/core-plugin-api@1.0.3
  - @backstage/catalog-model@1.0.3

## 0.6.6-next.2

### Patch Changes

- 5553f09e80: ability to configure refresh interval on Kubernetes tab
- Updated dependencies
  - @backstage/core-components@0.9.5-next.2

## 0.6.6-next.1

### Patch Changes

- b9b8bbc7d9: show request/limit CPU and Memory on the UI
- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/core-components@0.9.5-next.1
  - @backstage/core-plugin-api@1.0.3-next.0
  - @backstage/catalog-model@1.0.3-next.0
  - @backstage/plugin-catalog-react@1.1.1-next.1
  - @backstage/plugin-kubernetes-common@0.3.0-next.1

## 0.6.6-next.0

### Patch Changes

- 4328737af6: Add support to fetch data for Stateful Sets and display an accordion in the same way as with Deployments
- 81304e3e91: Fix for HPA matching when deploying same HPA in multiple namespaces
- Updated dependencies
  - @backstage/plugin-catalog-react@1.1.1-next.0
  - @backstage/core-components@0.9.5-next.0
  - @backstage/plugin-kubernetes-common@0.3.0-next.0

## 0.6.5

### Patch Changes

- 1ef98cfe48: add Azure Identity auth provider and AKS dashboard formatter
- 447e060872: Add support for 'oidc' as authProvider for kubernetes authentication
  and adds optional 'oidcTokenProvider' config value. This will allow
  users to authenticate to kubernetes cluster using id tokens obtained
  from the configured auth provider in their backstage instance.
- Updated dependencies
  - @backstage/core-components@0.9.4
  - @backstage/plugin-kubernetes-common@0.2.10
  - @backstage/core-plugin-api@1.0.2
  - @backstage/plugin-catalog-react@1.1.0
  - @backstage/config@1.0.1
  - @backstage/catalog-model@1.0.2

## 0.6.5-next.3

### Patch Changes

- 447e060872: Add support for 'oidc' as authProvider for kubernetes authentication
  and adds optional 'oidcTokenProvider' config value. This will allow
  users to authenticate to kubernetes cluster using id tokens obtained
  from the configured auth provider in their backstage instance.
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.2.10-next.1
  - @backstage/core-components@0.9.4-next.2

## 0.6.5-next.2

### Patch Changes

- 1ef98cfe48: add Azure Identity auth provider and AKS dashboard formatter
- Updated dependencies
  - @backstage/core-components@0.9.4-next.1
  - @backstage/plugin-kubernetes-common@0.2.10-next.0
  - @backstage/config@1.0.1-next.0
  - @backstage/plugin-catalog-react@1.1.0-next.2
  - @backstage/catalog-model@1.0.2-next.0
  - @backstage/core-plugin-api@1.0.2-next.1

## 0.6.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.4-next.0
  - @backstage/core-plugin-api@1.0.2-next.0
  - @backstage/plugin-catalog-react@1.1.0-next.1

## 0.6.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.1.0-next.0

## 0.6.4

### Patch Changes

- 82e2ae6ff6: build(deps): bump `cronstrue` from 1.125.0 to 2.2.0
- 7c7919777e: build(deps-dev): bump `@testing-library/react-hooks` from 7.0.2 to 8.0.0
- 24254fd433: build(deps): bump `@testing-library/user-event` from 13.5.0 to 14.0.0
- 1023ee6353: export kubernetes components
- 230ad0826f: Bump to using `@types/node` v16
- f616d99f6f: Fix division by zero in currentToDeclaredResourceToPerc when pod resources weren't set
- Updated dependencies
  - @backstage/plugin-catalog-react@1.0.1
  - @backstage/catalog-model@1.0.1
  - @backstage/core-components@0.9.3
  - @backstage/core-plugin-api@1.0.1
  - @backstage/plugin-kubernetes-common@0.2.9

## 0.6.4-next.2

### Patch Changes

- 82e2ae6ff6: build(deps): bump `cronstrue` from 1.125.0 to 2.2.0
- 24254fd433: build(deps): bump `@testing-library/user-event` from 13.5.0 to 14.0.0
- 230ad0826f: Bump to using `@types/node` v16
- Updated dependencies
  - @backstage/core-components@0.9.3-next.2
  - @backstage/core-plugin-api@1.0.1-next.0
  - @backstage/plugin-catalog-react@1.0.1-next.3

## 0.6.4-next.1

### Patch Changes

- 1023ee6353: export kubernetes components
- Updated dependencies
  - @backstage/plugin-catalog-react@1.0.1-next.1

## 0.6.4-next.0

### Patch Changes

- f616d99f6f: Fix division by zero in currentToDeclaredResourceToPerc when pod resources weren't set
- Updated dependencies
  - @backstage/catalog-model@1.0.1-next.0
  - @backstage/plugin-catalog-react@1.0.1-next.0
  - @backstage/core-components@0.9.3-next.0
  - @backstage/plugin-kubernetes-common@0.2.9-next.0

## 0.6.3

### Patch Changes

- a422d7ce5e: chore(deps): bump `@testing-library/react` from 11.2.6 to 12.1.3
- f24ef7864e: Minor typo fixes
- Updated dependencies
  - @backstage/core-components@0.9.2
  - @backstage/core-plugin-api@1.0.0
  - @backstage/plugin-catalog-react@1.0.0
  - @backstage/catalog-model@1.0.0
  - @backstage/config@1.0.0
  - @backstage/plugin-kubernetes-common@0.2.8

## 0.6.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@0.9.0
  - @backstage/core-components@0.9.1
  - @backstage/catalog-model@0.13.0
  - @backstage/plugin-kubernetes-common@0.2.7

## 0.6.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@0.9.0-next.0
  - @backstage/core-components@0.9.1-next.0
  - @backstage/catalog-model@0.13.0-next.0
  - @backstage/plugin-kubernetes-common@0.2.7-next.0

## 0.6.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.12.0
  - @backstage/core-components@0.9.0
  - @backstage/plugin-catalog-react@0.8.0
  - @backstage/core-plugin-api@0.8.0
  - @backstage/plugin-kubernetes-common@0.2.6

## 0.6.0

### Minor Changes

- 2262fe19c9: **BREAKING**: Removed support for passing in an explicit `entity` prop to entity page extensions, which has been deprecated for a long time. This is only a breaking change at the TypeScript level, as this property was already ignored.

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.10
  - @backstage/plugin-catalog-react@0.7.0
  - @backstage/catalog-model@0.11.0
  - @backstage/core-plugin-api@0.7.0
  - @backstage/plugin-kubernetes-common@0.2.5

## 0.5.8

### Patch Changes

- 1ed305728b: Bump `node-fetch` to version 2.6.7 and `cross-fetch` to version 3.1.5
- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/core-components@0.8.9
  - @backstage/core-plugin-api@0.6.1
  - @backstage/plugin-catalog-react@0.6.15
  - @backstage/catalog-model@0.10.0
  - @backstage/config@0.1.14
  - @backstage/theme@0.2.15
  - @backstage/plugin-kubernetes-common@0.2.3

## 0.5.7

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.8
  - @backstage/plugin-catalog-react@0.6.14

## 0.5.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.8-next.0
  - @backstage/plugin-catalog-react@0.6.14-next.0

## 0.5.6

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.7
  - @backstage/plugin-catalog-react@0.6.13

## 0.5.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.7-next.0
  - @backstage/plugin-catalog-react@0.6.13-next.0

## 0.5.5

### Patch Changes

- edbd626d0a: add a new auth provider to support use GOOGLE_APPLICATION_CREDENTIALS
- 51fbedc445: Migrated usage of deprecated `IdentityApi` methods.
- Updated dependencies
  - @backstage/core-components@0.8.5
  - @backstage/core-plugin-api@0.6.0
  - @backstage/plugin-catalog-react@0.6.12
  - @backstage/config@0.1.13
  - @backstage/catalog-model@0.9.10
  - @backstage/plugin-kubernetes-common@0.2.2

## 0.5.5-next.0

### Patch Changes

- 51fbedc445: Migrated usage of deprecated `IdentityApi` methods.
- Updated dependencies
  - @backstage/core-components@0.8.5-next.0
  - @backstage/core-plugin-api@0.6.0-next.0
  - @backstage/config@0.1.13-next.0
  - @backstage/plugin-catalog-react@0.6.12-next.0
  - @backstage/catalog-model@0.9.10-next.0
  - @backstage/plugin-kubernetes-common@0.2.2-next.0

## 0.5.4

### Patch Changes

- 7612e2856b: Clean up emptystate.svg image, removing wrong white artifact from the background
- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/core-components@0.8.4
  - @backstage/core-plugin-api@0.5.0
  - @backstage/plugin-catalog-react@0.6.11
  - @backstage/catalog-model@0.9.9

## 0.5.3

### Patch Changes

- 7ac0bd2c66: implement dashboard link formatter for GKE
- 4ce51ab0f1: Internal refactor of the `react-use` imports to use `react-use/lib/*` instead.
- Updated dependencies
  - @backstage/core-plugin-api@0.4.1
  - @backstage/plugin-catalog-react@0.6.10
  - @backstage/plugin-kubernetes-common@0.2.1
  - @backstage/core-components@0.8.3

## 0.5.2

### Patch Changes

- 610614a06d: Includes `KubernetesBackendClient` in the export to allow developers to use it externally.
- Updated dependencies
  - @backstage/core-plugin-api@0.4.0
  - @backstage/plugin-catalog-react@0.6.8
  - @backstage/core-components@0.8.2

## 0.5.1

### Patch Changes

- 6f0c850a86: Fixed styling bug for the CronJobsAccordions and updated Completed pods to display a green dot.
- Updated dependencies
  - @backstage/core-plugin-api@0.3.1
  - @backstage/core-components@0.8.1
  - @backstage/catalog-model@0.9.8
  - @backstage/plugin-catalog-react@0.6.7

## 0.5.0

### Minor Changes

- c010632f88: Add pod metrics lookup and display in pod table.

  ## Backwards incompatible changes

  If your Kubernetes distribution does not have the [metrics server](https://github.com/kubernetes-sigs/metrics-server) installed,
  you will need to set the `skipMetricsLookup` config flag to `true`.

  See the [configuration docs](https://backstage.io/docs/features/kubernetes/configuration) for more details.

### Patch Changes

- cd450844f6: Moved React dependencies to `peerDependencies` and allow both React v16 and v17 to be used.
- Updated dependencies
  - @backstage/core-components@0.8.0
  - @backstage/core-plugin-api@0.3.0
  - @backstage/plugin-kubernetes-common@0.2.0
  - @backstage/plugin-catalog-react@0.6.5

## 0.4.22

### Patch Changes

- 86ed770308: Added accordions to display information on Jobs and CronJobs in the kubernetes plugin. Updated the PodsTable with fewer default columns and the ability to pass in additional ones depending on the use case.
- Updated dependencies
  - @backstage/core-components@0.7.6
  - @backstage/theme@0.2.14
  - @backstage/core-plugin-api@0.2.2
  - @backstage/plugin-kubernetes-common@0.1.7

## 0.4.21

### Patch Changes

- 3739d3f773: Implement support for formatting OpenShift dashboard url links
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.1.6
  - @backstage/core-plugin-api@0.2.1
  - @backstage/core-components@0.7.5

## 0.4.20

### Patch Changes

- a125278b81: Refactor out the deprecated path and icon from RouteRefs
- Updated dependencies
  - @backstage/catalog-model@0.9.7
  - @backstage/plugin-catalog-react@0.6.4
  - @backstage/core-components@0.7.4
  - @backstage/core-plugin-api@0.2.0

## 0.4.19

### Patch Changes

- 9f3dd76bc7: fix: kubernetes plugin shall pass id token on get clusters request if possible
- Updated dependencies
  - @backstage/core-components@0.7.3
  - @backstage/theme@0.2.13
  - @backstage/core-plugin-api@0.1.13
  - @backstage/plugin-catalog-react@0.6.3

## 0.4.18

### Patch Changes

- 14df942bae: The Kubernetes plugin will now re-fetch the kubernetes objects every ten seconds (not current configurable), this allows users to track the progress of deployments without refreshing the browser.
- Updated dependencies
  - @backstage/config@0.1.11
  - @backstage/theme@0.2.12
  - @backstage/core-components@0.7.2
  - @backstage/plugin-catalog-react@0.6.2
  - @backstage/catalog-model@0.9.6
  - @backstage/core-plugin-api@0.1.12

## 0.4.17

### Patch Changes

- 89bcf90b66: Refactor kubernetes fetcher to reduce boilerplate code
- Updated dependencies
  - @backstage/plugin-catalog-react@0.6.0
  - @backstage/core-components@0.7.0
  - @backstage/theme@0.2.11

## 0.4.16

### Patch Changes

- c148c8854b: Support Rancher URL's with an existing path component
- ca0559444c: Avoid usage of `.to*Case()`, preferring `.toLocale*Case('en-US')` instead.
- 81a41ec249: Added a `name` key to all extensions in order to improve Analytics API metadata.
- Updated dependencies
  - @backstage/core-components@0.6.1
  - @backstage/core-plugin-api@0.1.10
  - @backstage/plugin-catalog-react@0.5.2
  - @backstage/catalog-model@0.9.4
  - @backstage/plugin-kubernetes-common@0.1.5

## 0.4.15

### Patch Changes

- e6aaf246c2: Enhanced deployment accordion to display the namespace of the deployment.
- 6ba06efe08: Exported `KubernetesApi`, `kubernetesApiRef`, and `KubernetesAuthProvidersApi`.
- 8d397ef27a: Added a check for the Kubernetes annotation on the entity
- 6c0bd7fb75: Add dashboard support for Rancher
- Updated dependencies
  - @backstage/core-plugin-api@0.1.9
  - @backstage/core-components@0.6.0
  - @backstage/plugin-catalog-react@0.5.1

## 0.4.14

### Patch Changes

- 7a0c334707: Provide access to the Kubernetes dashboard when viewing a specific resource
- Updated dependencies
  - @backstage/core-components@0.5.0
  - @backstage/plugin-catalog-react@0.5.0
  - @backstage/catalog-model@0.9.3
  - @backstage/config@0.1.10
  - @backstage/plugin-kubernetes-common@0.1.4

## 0.4.13

### Patch Changes

- 9f1362dcc1: Upgrade `@material-ui/lab` to `4.0.0-alpha.57`.
- Updated dependencies
  - @backstage/core-components@0.4.2
  - @backstage/plugin-catalog-react@0.4.6
  - @backstage/core-plugin-api@0.1.8

## 0.4.12

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@0.4.5
  - @backstage/core-components@0.4.0
  - @backstage/catalog-model@0.9.1

## 0.4.11

### Patch Changes

- 8bedb75ae: Update Luxon dependency to 2.x
- Updated dependencies
  - @backstage/core-components@0.3.1
  - @backstage/core-plugin-api@0.1.6
  - @backstage/plugin-catalog-react@0.4.2

## 0.4.10

### Patch Changes

- 260c053b9: Fix All Material UI Warnings
- Updated dependencies
  - @backstage/core-components@0.3.0
  - @backstage/config@0.1.6
  - @backstage/core-plugin-api@0.1.5
  - @backstage/plugin-catalog-react@0.4.1

## 0.4.9

### Patch Changes

- 9d40fcb1e: - Bumping `material-ui/core` version to at least `4.12.2` as they made some breaking changes in later versions which broke `Pagination` of the `Table`.
  - Switching out `material-table` to `@material-table/core` for support for the later versions of `material-ui/core`
  - This causes a minor API change to `@backstage/core-components` as the interface for `Table` re-exports the `prop` from the underlying `Table` components.
  - `onChangeRowsPerPage` has been renamed to `onRowsPerPageChange`
  - `onChangePage` has been renamed to `onPageChange`
  - Migration guide is here: https://material-table-core.com/docs/breaking-changes
- 7f24f4088: chore(deps): bump `@kubernetes/client-node` from 0.14.3 to 0.15.0
- Updated dependencies
  - @backstage/core-components@0.2.0
  - @backstage/plugin-catalog-react@0.4.0
  - @backstage/core-plugin-api@0.1.4
  - @backstage/theme@0.2.9
  - @backstage/plugin-kubernetes-common@0.1.3

## 0.4.8

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@0.3.0

## 0.4.7

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.1.5
  - @backstage/catalog-model@0.9.0
  - @backstage/plugin-catalog-react@0.2.6
  - @backstage/plugin-kubernetes-common@0.1.2

## 0.4.6

### Patch Changes

- 48c9fcd33: Migrated to use the new `@backstage/core-*` packages rather than `@backstage/core`.
- Updated dependencies
  - @backstage/core-plugin-api@0.1.3
  - @backstage/catalog-model@0.8.4
  - @backstage/plugin-catalog-react@0.2.4

## 0.4.5

### Patch Changes

- Updated dependencies [add62a455]
- Updated dependencies [cc592248b]
- Updated dependencies [17c497b81]
- Updated dependencies [704875e26]
  - @backstage/catalog-model@0.8.0
  - @backstage/core@0.7.11
  - @backstage/plugin-catalog-react@0.2.0
  - @backstage/plugin-kubernetes-common@0.1.1

## 0.4.4

### Patch Changes

- 062bbf90f: chore: bump `@testing-library/user-event` from 12.8.3 to 13.1.8
- ea21d46f0: Export types
- 675a569a9: chore: bump `react-use` dependency in all packages
- Updated dependencies [062bbf90f]
- Updated dependencies [10c008a3a]
- Updated dependencies [889d89b6e]
- Updated dependencies [16be1d093]
- Updated dependencies [3f988cb63]
- Updated dependencies [675a569a9]
  - @backstage/core@0.7.9
  - @backstage/plugin-catalog-react@0.1.6
  - @backstage/catalog-model@0.7.9

## 0.4.3

### Patch Changes

- f53fba29f: Adds @backstage/plugin-kubernetes-common library to share types between kubernetes frontend and backend.
- Updated dependencies [f65adcde7]
- Updated dependencies [81c54d1f2]
- Updated dependencies [80888659b]
- Updated dependencies [7b8272fb7]
- Updated dependencies [d8b81fd28]
  - @backstage/core@0.7.8
  - @backstage/plugin-catalog-react@0.1.5
  - @backstage/theme@0.2.7
  - @backstage/catalog-model@0.7.8
  - @backstage/config@0.1.5

## 0.4.2

### Patch Changes

- a2a3c7803: Bump `@kubernetes/client-node` from `^0.13.2` to `^0.14.0`.
- Updated dependencies [a2a3c7803]
- Updated dependencies [01ccef4c7]
- Updated dependencies [fcc3ada24]
- Updated dependencies [4618774ff]
- Updated dependencies [df59930b3]
  - @backstage/plugin-kubernetes-backend@0.3.2
  - @backstage/plugin-catalog-react@0.1.3
  - @backstage/core@0.7.3
  - @backstage/theme@0.2.5

## 0.4.1

### Patch Changes

- 1df417bd3: Add tests for kubernetes custom hook
- 9ca0e4009: use local version of lowerCase and upperCase methods
- 1f98a6ff8: Filter out k8s cluster with no resources or errors
- Updated dependencies [0434853a5]
- Updated dependencies [8686eb38c]
- Updated dependencies [9ca0e4009]
- Updated dependencies [34ff49b0f]
- Updated dependencies [1f98a6ff8]
  - @backstage/config@0.1.4
  - @backstage/core@0.7.2
  - @backstage/plugin-catalog-react@0.1.2
  - @backstage/plugin-kubernetes-backend@0.3.1

## 0.4.0

### Minor Changes

- 9581ff0b4: Restructure configuration; Add GKE cluster locator

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

- e2c1b3fb6: Add initial CRD support framework

### Patch Changes

- 763926bc1: Adds a new method `getClusters` to grab cluster configuration in the frontend
- Updated dependencies [5d7834baf]
- Updated dependencies [0b42fff22]
- Updated dependencies [ff4d666ab]
- Updated dependencies [9581ff0b4]
- Updated dependencies [2089de76b]
- Updated dependencies [dc1fc92c8]
- Updated dependencies [8de9963f0]
- Updated dependencies [e2c1b3fb6]
  - @backstage/plugin-kubernetes-backend@0.3.0
  - @backstage/catalog-model@0.7.4
  - @backstage/core@0.7.1
  - @backstage/theme@0.2.4

## 0.3.12

### Patch Changes

- ba21797ca: k8s plugin now surfaces k8s components with only label selector query annotation.
  Previously backstage.io/kubernetes-label-selector catalog entity annotation would only work if you also included backstage.io/kubernetes-id.
  But backstage.io/kubernetes-id value was ignored
- 42c8ebb79: Support AWS auth provider on kubernetes FE plugin
- Updated dependencies [12d8f27a6]
- Updated dependencies [f43192207]
- Updated dependencies [e3adec2bd]
- Updated dependencies [40c0fdbaa]
- Updated dependencies [2a271d89e]
- Updated dependencies [bece09057]
- Updated dependencies [169f48deb]
- Updated dependencies [8a1566719]
- Updated dependencies [9d455f69a]
- Updated dependencies [4c049a1a1]
- Updated dependencies [02816ecd7]
  - @backstage/catalog-model@0.7.3
  - @backstage/plugin-kubernetes-backend@0.2.8
  - @backstage/core@0.7.0
  - @backstage/plugin-catalog-react@0.1.1

## 0.3.11

### Patch Changes

- Updated dependencies [a70af22a2]
- Updated dependencies [3a58084b6]
- Updated dependencies [e799e74d4]
- Updated dependencies [d0760ecdf]
- Updated dependencies [1407b34c6]
- Updated dependencies [88f1f1b60]
- Updated dependencies [bad21a085]
- Updated dependencies [9615e68fb]
- Updated dependencies [49f9b7346]
- Updated dependencies [5c2e2863f]
- Updated dependencies [3a58084b6]
- Updated dependencies [a1f5e6545]
- Updated dependencies [2c1f2a7c2]
  - @backstage/plugin-kubernetes-backend@0.2.7
  - @backstage/core@0.6.3
  - @backstage/plugin-catalog-react@0.1.0
  - @backstage/catalog-model@0.7.2
  - @backstage/config@0.1.3

## 0.3.10

### Patch Changes

- Updated dependencies [fd3f2a8c0]
- Updated dependencies [d34d26125]
- Updated dependencies [0af242b6d]
- Updated dependencies [f4c2bcf54]
- Updated dependencies [10a0124e0]
- Updated dependencies [07e226872]
- Updated dependencies [f62e7abe5]
- Updated dependencies [96f378d10]
- Updated dependencies [688b73110]
  - @backstage/core@0.6.2
  - @backstage/plugin-catalog-react@0.0.4

## 0.3.9

### Patch Changes

- 6ed2b47d6: Include Backstage identity token in requests to backend plugins.
- 64b9efac2: Migrate to new composability API, exporting the plugin instance as `kubernetesPlugin` and entity content as `EntityKubernetesContent`.
- Updated dependencies [19d354c78]
- Updated dependencies [b51ee6ece]
  - @backstage/plugin-catalog-react@0.0.3
  - @backstage/core@0.6.1

## 0.3.8

### Patch Changes

- Updated dependencies [12ece98cd]
- Updated dependencies [d82246867]
- Updated dependencies [c810082ae]
- Updated dependencies [5fa3bdb55]
- Updated dependencies [6e612ce25]
- Updated dependencies [025e122c3]
- Updated dependencies [21e624ba9]
- Updated dependencies [da9f53c60]
- Updated dependencies [32c95605f]
- Updated dependencies [7881f2117]
- Updated dependencies [54c7d02f7]
- Updated dependencies [11cb5ef94]
  - @backstage/core@0.6.0
  - @backstage/theme@0.2.3
  - @backstage/catalog-model@0.7.1

## 0.3.7

### Patch Changes

- 681111228: Add AWS auth provider for Kubernetes
- a6e3b9596: Improve error reporting for plugin misconfiguration.
- Updated dependencies [681111228]
  - @backstage/plugin-kubernetes-backend@0.2.6

## 0.3.6

### Patch Changes

- d014185db: Show Kubernetes Service manifests.
  Show Kubernetes Ingress manifests.
- Updated dependencies [def2307f3]
- Updated dependencies [d54857099]
- Updated dependencies [efd6ef753]
- Updated dependencies [a187b8ad0]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0
  - @backstage/plugin-kubernetes-backend@0.2.5
  - @backstage/core@0.5.0

## 0.3.5

### Patch Changes

- 1fea88fd0: Fixed an issue where assets weren't properly bundled in the published package.

## 0.3.4

### Patch Changes

- 5a9a7e7c2: Revamped Kubernetes UI and added error reporting/detection
- 3e7c09c84: Minor updates to display of errors
- Updated dependencies [5a9a7e7c2]
- Updated dependencies [f3b064e1c]
- Updated dependencies [265a7ab30]
- Updated dependencies [abbee6fff]
- Updated dependencies [147fadcb9]
  - @backstage/plugin-kubernetes-backend@0.2.4
  - @backstage/catalog-model@0.6.1
  - @backstage/core@0.4.4

## 0.3.3

### Patch Changes

- Updated dependencies [c911061b7]
- Updated dependencies [8ef71ed32]
- Updated dependencies [0e6298f7e]
- Updated dependencies [ac3560b42]
  - @backstage/catalog-model@0.6.0
  - @backstage/core@0.4.1
  - @backstage/plugin-kubernetes-backend@0.2.3

## 0.3.2

### Patch Changes

- Updated dependencies [2527628e1]
- Updated dependencies [e3bd9fc2f]
- Updated dependencies [1c69d4716]
- Updated dependencies [83b6e0c1f]
- Updated dependencies [1665ae8bb]
- Updated dependencies [04f26f88d]
- Updated dependencies [ff243ce96]
- Updated dependencies [e3bd9fc2f]
  - @backstage/core@0.4.0
  - @backstage/config@0.1.2
  - @backstage/catalog-model@0.5.0
  - @backstage/theme@0.2.2
  - @backstage/plugin-kubernetes-backend@0.2.2

## 0.3.1

### Patch Changes

- bcc211a08: k8s-plugin: refactor approach to use annotation based label-selector
- Updated dependencies [08835a61d]
- Updated dependencies [a9fd599f7]
- Updated dependencies [bcc211a08]
  - @backstage/catalog-model@0.4.0
  - @backstage/plugin-kubernetes-backend@0.2.1

## 0.3.0

### Minor Changes

- 1166fcc36: add kubernetes selector to component model

### Patch Changes

- Updated dependencies [475fc0aaa]
- Updated dependencies [1166fcc36]
- Updated dependencies [1185919f3]
  - @backstage/core@0.3.2
  - @backstage/catalog-model@0.3.0
  - @backstage/plugin-kubernetes-backend@0.2.0

## 0.2.1

### Patch Changes

- Updated dependencies [7b37d65fd]
- Updated dependencies [4aca74e08]
- Updated dependencies [e8f69ba93]
- Updated dependencies [0c0798f08]
- Updated dependencies [0c0798f08]
- Updated dependencies [199237d2f]
- Updated dependencies [6627b626f]
- Updated dependencies [4577e377b]
  - @backstage/core@0.3.0
  - @backstage/theme@0.2.1

## 0.2.0

### Minor Changes

- 28edd7d29: Create backend plugin through CLI

### Patch Changes

- Updated dependencies [819a70229]
- Updated dependencies [3a4236570]
- Updated dependencies [ae5983387]
- Updated dependencies [0d4459c08]
- Updated dependencies [482b6313d]
- Updated dependencies [e0be86b6f]
- Updated dependencies [f70a52868]
- Updated dependencies [12b5fe940]
- Updated dependencies [1c60f716e]
- Updated dependencies [144c66d50]
- Updated dependencies [a768a07fb]
- Updated dependencies [b79017fd3]
- Updated dependencies [6d97d2d6f]
- Updated dependencies [5adfc005e]
- Updated dependencies [93a3fa3ae]
- Updated dependencies [782f3b354]
- Updated dependencies [2713f28f4]
- Updated dependencies [406015b0d]
- Updated dependencies [82759d3e4]
- Updated dependencies [ac8d5d5c7]
- Updated dependencies [fa56f4615]
- Updated dependencies [ebca83d48]
- Updated dependencies [aca79334f]
- Updated dependencies [c0d5242a0]
- Updated dependencies [b3d57961c]
- Updated dependencies [3beb5c9fc]
- Updated dependencies [754e31db5]
- Updated dependencies [1611c6dbc]
  - @backstage/core@0.2.0
  - @backstage/catalog-model@0.2.0
  - @backstage/theme@0.2.0
  - @backstage/plugin-kubernetes-backend@0.1.2
