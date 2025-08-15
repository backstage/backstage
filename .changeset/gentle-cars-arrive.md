---
'@backstage/plugin-kubernetes-backend': minor
---

**BREAKING CHANGE**: Removed support for the legacy backend system. This means that the deprecated `createRouter` and `KubernetesBuilder` and related types have been removed. Please refer to the [relevant documentation](https://backstage.io/docs/features/kubernetes/installation/#adding-kubernetes-backend-plugin) to configure the Kubernetes plugin.

**BREAKING CHANGE**: The deprecated types `AuthenticationStrategy`, `AuthMetadata`, `ClusterDetails`, `CustomResource`, `CustomResourcesByEntity`, `FetchResponseWrapper`, `KubernetesBuilder`, `KubernetesBuilderReturn`, `KubernetesClustersSupplier`, `KubernetesCredential`, `KubernetesEnvironment`, `KubernetesFetcher`, `KubernetesObjectsProvider`, `KubernetesObjectTypes`, `KubernetesServiceLocator`,`ObjectFetchParams`, `ObjectToFetch`,`RouterOptions` and `ServiceLocatorRequestContext` should all now be imported from `@backstage/plugin-kubernetes-node`.
