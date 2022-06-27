# @backstage/plugin-kubernetes-backend

## 0.7.0-next.0

### Minor Changes

- 0791af993f: Refactor `KubernetesObjectsProvider` with new methods, `KubernetesServiceLocator` now takes an `Entity` instead of `serviceId`

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.0
  - @backstage/catalog-model@1.1.0-next.0
  - @backstage/plugin-kubernetes-common@0.4.0-next.0

## 0.6.0

### Minor Changes

- 4328737af6: Add support to fetch data for Stateful Sets from Kubernetes

### Patch Changes

- 0c70cd8e1d: cache and refresh Azure tokens to avoid excessive calls to Azure Identity
- 2aedf64ad3: Updated dependency `@google-cloud/container` to `^4.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.0
  - @backstage/plugin-kubernetes-common@0.3.0
  - @backstage/catalog-model@1.0.3

## 0.6.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.0-next.2

## 0.6.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.6-next.1
  - @backstage/catalog-model@1.0.3-next.0
  - @backstage/plugin-kubernetes-common@0.3.0-next.1

## 0.6.0-next.0

### Minor Changes

- 4328737af6: Add support to fetch data for Stateful Sets from Kubernetes

### Patch Changes

- 0c70cd8e1d: cache and refresh Azure tokens to avoid excessive calls to Azure Identity
- Updated dependencies
  - @backstage/backend-common@0.13.6-next.0
  - @backstage/plugin-kubernetes-common@0.3.0-next.0

## 0.5.1

### Patch Changes

- 1ef98cfe48: add Azure Identity auth provider and AKS dashboard formatter
- b9f7ffb162: Add filtering to GKE cluster locator
- 447e060872: Add support for 'oidc' as authProvider for kubernetes authentication
  and adds optional 'oidcTokenProvider' config value. This will allow
  users to authenticate to kubernetes cluster using id tokens obtained
  from the configured auth provider in their backstage instance.
- cfc0f19699: Updated dependency `fs-extra` to `10.1.0`.
- Updated dependencies
  - @backstage/backend-common@0.13.3
  - @backstage/plugin-kubernetes-common@0.2.10
  - @backstage/config@1.0.1
  - @backstage/catalog-model@1.0.2

## 0.5.1-next.2

### Patch Changes

- 447e060872: Add support for 'oidc' as authProvider for kubernetes authentication
  and adds optional 'oidcTokenProvider' config value. This will allow
  users to authenticate to kubernetes cluster using id tokens obtained
  from the configured auth provider in their backstage instance.
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.2.10-next.1

## 0.5.1-next.1

### Patch Changes

- 1ef98cfe48: add Azure Identity auth provider and AKS dashboard formatter
- Updated dependencies
  - @backstage/backend-common@0.13.3-next.2
  - @backstage/plugin-kubernetes-common@0.2.10-next.0
  - @backstage/config@1.0.1-next.0
  - @backstage/catalog-model@1.0.2-next.0

## 0.5.1-next.0

### Patch Changes

- b9f7ffb162: Add filtering to GKE cluster locator
- cfc0f19699: Updated dependency `fs-extra` to `10.1.0`.
- Updated dependencies
  - @backstage/backend-common@0.13.3-next.0

## 0.5.0

### Minor Changes

- 3d45427666: **BREAKING** Custom cluster suppliers need to cache their getClusters result

  To allow custom `KubernetesClustersSupplier` instances to refresh the list of clusters
  the `getClusters` method is now called whenever the list of clusters is needed.

  Existing `KubernetesClustersSupplier` implementations will need to ensure that `getClusters`
  can be called frequently and should return a cached result from `getClusters` instead.

  For example, here's a simple example of a custom supplier in `packages/backend/src/plugins/kubernetes.ts`:

  ```diff
  -import { KubernetesBuilder } from '@backstage/plugin-kubernetes-backend';
  +import {
  +  ClusterDetails,
  +  KubernetesBuilder,
  +  KubernetesClustersSupplier,
  +} from '@backstage/plugin-kubernetes-backend';
   import { Router } from 'express';
   import { PluginEnvironment } from '../types';
  +import { Duration } from 'luxon';
  +
  +export class CustomClustersSupplier implements KubernetesClustersSupplier {
  +  constructor(private clusterDetails: ClusterDetails[] = []) {}
  +
  +  static create(refreshInterval: Duration) {
  +    const clusterSupplier = new CustomClustersSupplier();
  +    // setup refresh, e.g. using a copy of https://github.com/backstage/backstage/blob/master/plugins/search-backend-node/src/runPeriodically.ts
  +    runPeriodically(
  +      () => clusterSupplier.refreshClusters(),
  +      refreshInterval.toMillis(),
  +    );
  +    return clusterSupplier;
  +  }
  +
  +  async refreshClusters(): Promise<void> {
  +    this.clusterDetails = []; // fetch from somewhere
  +  }
  +
  +  async getClusters(): Promise<ClusterDetails[]> {
  +    return this.clusterDetails;
  +  }
  +}

   export default async function createPlugin(
     env: PluginEnvironment,
   ): Promise<Router> {
  -  const { router } = await KubernetesBuilder.createBuilder({
  +  const builder = await KubernetesBuilder.createBuilder({
       logger: env.logger,
       config: env.config,
  -  }).build();
  +  });
  +  builder.setClusterSupplier(
  +    CustomClustersSupplier.create(Duration.fromObject({ minutes: 60 })),
  +  );
  +  const { router } = await builder.build();
  ```

### Patch Changes

- 753a20c89e: Add kubernetes namespace annotation `backstage.io/kubernetes-namespace` to allow namespaced Kubernetes resources fetches
- Updated dependencies
  - @backstage/catalog-model@1.0.1
  - @backstage/backend-common@0.13.2
  - @backstage/plugin-kubernetes-common@0.2.9

## 0.5.0-next.1

### Minor Changes

- 3d45427666: **BREAKING** Custom cluster suppliers need to cache their getClusters result

  To allow custom `KubernetesClustersSupplier` instances to refresh the list of clusters
  the `getClusters` method is now called whenever the list of clusters is needed.

  Existing `KubernetesClustersSupplier` implementations will need to ensure that `getClusters`
  can be called frequently and should return a cached result from `getClusters` instead.

  For example, here's a simple example of a custom supplier in `packages/backend/src/plugins/kubernetes.ts`:

  ```diff
  -import { KubernetesBuilder } from '@backstage/plugin-kubernetes-backend';
  +import {
  +  ClusterDetails,
  +  KubernetesBuilder,
  +  KubernetesClustersSupplier,
  +} from '@backstage/plugin-kubernetes-backend';
   import { Router } from 'express';
   import { PluginEnvironment } from '../types';
  +import { Duration } from 'luxon';
  +
  +export class CustomClustersSupplier implements KubernetesClustersSupplier {
  +  constructor(private clusterDetails: ClusterDetails[] = []) {}
  +
  +  static create(refreshInterval: Duration) {
  +    const clusterSupplier = new CustomClustersSupplier();
  +    // setup refresh, e.g. using a copy of https://github.com/backstage/backstage/blob/master/plugins/search-backend-node/src/runPeriodically.ts
  +    runPeriodically(
  +      () => clusterSupplier.refreshClusters(),
  +      refreshInterval.toMillis(),
  +    );
  +    return clusterSupplier;
  +  }
  +
  +  async refreshClusters(): Promise<void> {
  +    this.clusterDetails = []; // fetch from somewhere
  +  }
  +
  +  async getClusters(): Promise<ClusterDetails[]> {
  +    return this.clusterDetails;
  +  }
  +}

   export default async function createPlugin(
     env: PluginEnvironment,
   ): Promise<Router> {
  -  const { router } = await KubernetesBuilder.createBuilder({
  +  const builder = await KubernetesBuilder.createBuilder({
       logger: env.logger,
       config: env.config,
  -  }).build();
  +  });
  +  builder.setClusterSupplier(
  +    CustomClustersSupplier.create(Duration.fromObject({ minutes: 60 })),
  +  );
  +  const { router } = await builder.build();
  ```

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.2-next.2

## 0.4.14-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.1-next.0
  - @backstage/backend-common@0.13.2-next.0
  - @backstage/plugin-kubernetes-common@0.2.9-next.0

## 0.4.13

### Patch Changes

- dab7f8dbd3: build(deps): bump `@google-cloud/container` from 2.3.0 to 3.0.0
- f24ef7864e: Minor typo fixes
- Updated dependencies
  - @backstage/backend-common@0.13.1
  - @backstage/catalog-model@1.0.0
  - @backstage/config@1.0.0
  - @backstage/errors@1.0.0
  - @backstage/plugin-kubernetes-common@0.2.8

## 0.4.12

### Patch Changes

- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1
- 35e58d57aa: refactor kubernetes fetcher
- Updated dependencies
  - @backstage/backend-common@0.13.0
  - @backstage/catalog-model@0.13.0
  - @backstage/plugin-kubernetes-common@0.2.7

## 0.4.12-next.0

### Patch Changes

- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1
- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0
  - @backstage/catalog-model@0.13.0-next.0
  - @backstage/plugin-kubernetes-common@0.2.7-next.0

## 0.4.11

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.12.0
  - @backstage/backend-common@0.12.0
  - @backstage/plugin-kubernetes-common@0.2.6

## 0.4.10

### Patch Changes

- 64acf65c03: Allow missing kubernetes config in development env
- Updated dependencies
  - @backstage/backend-common@0.11.0
  - @backstage/catalog-model@0.11.0
  - @backstage/plugin-kubernetes-common@0.2.5

## 0.4.9

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/backend-common@0.10.9
  - @backstage/catalog-model@0.10.1
  - @backstage/config@0.1.15
  - @backstage/errors@0.2.2
  - @backstage/plugin-kubernetes-common@0.2.4

## 0.4.8

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- 0107c9aa08: chore(deps): bump `helmet` from 4.4.1 to 5.0.2
- fb09a59a3f: Fixed a potential issue in AWS token encoding, where they might not always be properly converted to URL-safe base64.
- Updated dependencies
  - @backstage/backend-common@0.10.8
  - @backstage/errors@0.2.1
  - @backstage/catalog-model@0.10.0
  - @backstage/config@0.1.14
  - @backstage/plugin-kubernetes-common@0.2.3

## 0.4.7

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.7

## 0.4.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.7-next.0

## 0.4.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6

## 0.4.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6-next.0

## 0.4.5

### Patch Changes

- 8fc0d122e8: If serviceAccountToken not provided, use default config file from cluster
- Updated dependencies
  - @backstage/backend-common@0.10.5

## 0.4.4

### Patch Changes

- edbd626d0a: add a new auth provider to support use GOOGLE_APPLICATION_CREDENTIALS
- Updated dependencies
  - @backstage/backend-common@0.10.4
  - @backstage/config@0.1.13
  - @backstage/catalog-model@0.9.10
  - @backstage/plugin-kubernetes-common@0.2.2

## 0.4.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.4-next.0
  - @backstage/config@0.1.13-next.0
  - @backstage/catalog-model@0.9.10-next.0
  - @backstage/plugin-kubernetes-common@0.2.2-next.0

## 0.4.3

### Patch Changes

- a67ec8527f: Exclude the AWS session token from credential validation, because it's not necessary in this context.
- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/backend-common@0.10.3
  - @backstage/errors@0.2.0
  - @backstage/catalog-model@0.9.9

## 0.4.2

### Patch Changes

- 7ac0bd2c66: implement dashboard link formatter for GKE
- Updated dependencies
  - @backstage/backend-common@0.10.2
  - @backstage/plugin-kubernetes-common@0.2.1

## 0.4.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.0

## 0.4.0

### Minor Changes

- c010632f88: Add pod metrics lookup and display in pod table.

  ## Backwards incompatible changes

  If your Kubernetes distribution does not have the [metrics server](https://github.com/kubernetes-sigs/metrics-server) installed,
  you will need to set the `skipMetricsLookup` config flag to `false`.

  See the [configuration docs](https://backstage.io/docs/features/kubernetes/configuration) for more details.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.2.0
  - @backstage/backend-common@0.9.13

## 0.3.20

### Patch Changes

- 65ddccb5e8: Added apiVersionOverrides config to allow for specifying api versions to use for kubernetes objects
- f6087fc8f8: Query CronJobs from Kubernetes with apiGroup BatchV1beta1
- Updated dependencies
  - @backstage/backend-common@0.9.12
  - @backstage/plugin-kubernetes-common@0.1.7

## 0.3.19

### Patch Changes

- 37dc844728: Include CronJobs and Jobs as default objects returned by the kubernetes backend and add/update relevant types.
- Updated dependencies
  - @backstage/errors@0.1.5
  - @backstage/plugin-kubernetes-common@0.1.6
  - @backstage/backend-common@0.9.11

## 0.3.18

### Patch Changes

- b61c50a12f: Fix Kubernetes plugin custom objects lookup regression
- c57b075d18: add caData support for kubernetes client config
- 36e67d2f24: Internal updates to apply more strict checks to throw errors.
- Updated dependencies
  - @backstage/backend-common@0.9.7
  - @backstage/errors@0.1.3
  - @backstage/catalog-model@0.9.5

## 0.3.17

### Patch Changes

- 89bcf90b66: Refactor kubernetes fetcher to reduce boilerplate code
- a982e166c5: Enable customization of services used by the kubernetes backend plugin

  The createRouter function has been deprecated in favor of a KubernetesBuilder object.
  Here's how you should upgrade your projects when configuring the Kubernetes backend plugin.
  in your `packages/backend/src/plugins/kubernetes.ts` file for instance:

  ```typescript
  import { KubernetesBuilder } from '@backstage/plugin-kubernetes-backend';
  import { PluginEnvironment } from '../types';

  export default async function createPlugin({
    logger,
    config,
  }: PluginEnvironment) {
    const { router } = await KubernetesBuilder.createBuilder({
      logger,
      config,
    }).build();
    return router;
  }
  ```

## 0.3.16

### Patch Changes

- febddedcb2: Bump `lodash` to remediate `SNYK-JS-LODASH-590103` security vulnerability
- 7a0c334707: Provide access to the Kubernetes dashboard when viewing a specific resource
- Updated dependencies
  - @backstage/catalog-model@0.9.3
  - @backstage/backend-common@0.9.4
  - @backstage/config@0.1.10
  - @backstage/plugin-kubernetes-common@0.1.4

## 0.3.15

### Patch Changes

- 22fc579fe: Fixes bug reading ExternalId from k8s backend config
- Updated dependencies
  - @backstage/backend-common@0.9.0
  - @backstage/config@0.1.8

## 0.3.14

### Patch Changes

- bbcd92afa: Adds ability to send an ExternalId with the assume role request to AWS
- Updated dependencies
  - @backstage/backend-common@0.8.9

## 0.3.13

### Patch Changes

- a0a8d3571: Add configuration option to the kubernetes object types. Config option is under `kubernetes.objectTypes`. Defaults to ['pods', 'services', 'configmaps', 'deployments', 'replicasets', 'horizontalpodautoscalers', 'ingresses']
- Updated dependencies
  - @backstage/backend-common@0.8.8
  - @backstage/config@0.1.6

## 0.3.12

### Patch Changes

- 7f24f4088: chore(deps): bump `@kubernetes/client-node` from 0.14.3 to 0.15.0
- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.1.3

## 0.3.11

### Patch Changes

- 5bd57f8f5: Support assume role on kubernetes api configuration for AWS.
- Updated dependencies
  - @backstage/backend-common@0.8.7

## 0.3.10

### Patch Changes

- ae84b20cf: Revert the upgrade to `fs-extra@10.0.0` as that seemed to have broken all installs inexplicably.
- Updated dependencies
  - @backstage/backend-common@0.8.6

## 0.3.9

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.9.0
  - @backstage/backend-common@0.8.5
  - @backstage/plugin-kubernetes-common@0.1.2

## 0.3.8

### Patch Changes

- Updated dependencies [add62a455]
- Updated dependencies [704875e26]
  - @backstage/catalog-model@0.8.0
  - @backstage/plugin-kubernetes-common@0.1.1

## 0.3.7

### Patch Changes

- f9f9d633d: Add possibility to configure TLS verification for `gke` type clusters
- Updated dependencies [22fd8ce2a]
- Updated dependencies [10c008a3a]
- Updated dependencies [f9fb4a205]
- Updated dependencies [16be1d093]
  - @backstage/backend-common@0.8.0
  - @backstage/catalog-model@0.7.9

## 0.3.6

### Patch Changes

- f53fba29f: Adds @backstage/plugin-kubernetes-common library to share types between kubernetes frontend and backend.
- Updated dependencies [e0bfd3d44]
- Updated dependencies [38ca05168]
- Updated dependencies [d8b81fd28]
  - @backstage/backend-common@0.7.0
  - @backstage/catalog-model@0.7.8
  - @backstage/config@0.1.5

## 0.3.5

### Patch Changes

- c42cd1daa: Kubernetes client TLS verification is now configurable and defaults to true
- Updated dependencies [d367f63b5]
- Updated dependencies [b42531cfe]
  - @backstage/backend-common@0.6.3

## 0.3.4

### Patch Changes

- 7fd46f26d: Use `string` TypeScript type instead of `String`.
- Updated dependencies [bb5055aee]
- Updated dependencies [5d0740563]
  - @backstage/catalog-model@0.7.7

## 0.3.3

### Patch Changes

- 1ac6a5233: updated entity name to be set through annotations or fallback
- 60e463c8d: Load credentials properly for AWS Kubernetes Auth Translator
- Updated dependencies [8488a1a96]
- Updated dependencies [37e3a69f5]
  - @backstage/catalog-model@0.7.5
  - @backstage/backend-common@0.6.1

## 0.3.2

### Patch Changes

- a2a3c7803: Bump `@kubernetes/client-node` from `^0.13.2` to `^0.14.0`.

## 0.3.1

### Patch Changes

- 1f98a6ff8: Filter out k8s cluster with no resources or errors
- Updated dependencies [8686eb38c]
- Updated dependencies [0434853a5]
- Updated dependencies [8686eb38c]
  - @backstage/backend-common@0.6.0
  - @backstage/config@0.1.4

## 0.3.0

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

- 5d7834baf: Use AWS SDK V2 instead of V3 for Kubernetes authentication
- 8de9963f0: Remove Kubernetes client caching
- Updated dependencies [d7245b733]
- Updated dependencies [0b42fff22]
- Updated dependencies [761698831]
  - @backstage/backend-common@0.5.6
  - @backstage/catalog-model@0.7.4

## 0.2.8

### Patch Changes

- f43192207: remove usage of res.send() for res.json() and res.end() to ensure content types are more consistently application/json on backend responses and error cases
- e3adec2bd: Allow apps to pass in a KubernetesClustersSupplier
- Updated dependencies [12d8f27a6]
- Updated dependencies [497859088]
- Updated dependencies [8adb48df4]
  - @backstage/catalog-model@0.7.3
  - @backstage/backend-common@0.5.5

## 0.2.7

### Patch Changes

- a70af22a2: update kubernetes plugin backend function to use classes
- Updated dependencies [bad21a085]
- Updated dependencies [a1f5e6545]
  - @backstage/catalog-model@0.7.2
  - @backstage/config@0.1.3

## 0.2.6

### Patch Changes

- 681111228: Add AWS auth provider for Kubernetes
- Updated dependencies [26a3a6cf0]
- Updated dependencies [664dd08c9]
- Updated dependencies [9dd057662]
  - @backstage/backend-common@0.5.1

## 0.2.5

### Patch Changes

- d54857099: Support HTTP 400 Bad Request from Kubernetes API
- Updated dependencies [def2307f3]
- Updated dependencies [0b135e7e0]
- Updated dependencies [294a70cab]
- Updated dependencies [0ea032763]
- Updated dependencies [5345a1f98]
- Updated dependencies [09a370426]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0
  - @backstage/backend-common@0.5.0

## 0.2.4

### Patch Changes

- 5a9a7e7c2: Revamped Kubernetes UI and added error reporting/detection
- Updated dependencies [f3b064e1c]
- Updated dependencies [abbee6fff]
- Updated dependencies [147fadcb9]
  - @backstage/catalog-model@0.6.1
  - @backstage/backend-common@0.4.3

## 0.2.3

### Patch Changes

- Updated dependencies [c911061b7]
- Updated dependencies [1d1c2860f]
- Updated dependencies [0e6298f7e]
- Updated dependencies [4eafdec4a]
- Updated dependencies [ac3560b42]
  - @backstage/catalog-model@0.6.0
  - @backstage/backend-common@0.4.1

## 0.2.2

### Patch Changes

- Updated dependencies [38e24db00]
- Updated dependencies [e3bd9fc2f]
- Updated dependencies [12bbd748c]
- Updated dependencies [83b6e0c1f]
- Updated dependencies [e3bd9fc2f]
  - @backstage/backend-common@0.4.0
  - @backstage/config@0.1.2
  - @backstage/catalog-model@0.5.0

## 0.2.1

### Patch Changes

- bcc211a08: k8s-plugin: refactor approach to use annotation based label-selector
- Updated dependencies [612368274]
- Updated dependencies [08835a61d]
- Updated dependencies [a9fd599f7]
- Updated dependencies [bcc211a08]
  - @backstage/backend-common@0.3.3
  - @backstage/catalog-model@0.4.0

## 0.2.0

### Minor Changes

- 1166fcc36: add kubernetes selector to component model

### Patch Changes

- Updated dependencies [1166fcc36]
- Updated dependencies [bff3305aa]
- Updated dependencies [1185919f3]
- Updated dependencies [b47dce06f]
  - @backstage/catalog-model@0.3.0
  - @backstage/backend-common@0.3.1

## 0.1.3

### Patch Changes

- Updated dependencies [1722cb53c]
- Updated dependencies [1722cb53c]
- Updated dependencies [7b37e6834]
- Updated dependencies [8e2effb53]
  - @backstage/backend-common@0.3.0

## 0.1.2

### Patch Changes

- Updated dependencies [5249594c5]
- Updated dependencies [56e4eb589]
- Updated dependencies [e37c0a005]
- Updated dependencies [f00ca3cb8]
- Updated dependencies [6579769df]
- Updated dependencies [8c2b76e45]
- Updated dependencies [440a17b39]
- Updated dependencies [8afce088a]
- Updated dependencies [7bbeb049f]
  - @backstage/backend-common@0.2.0
