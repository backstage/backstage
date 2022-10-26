---
'@backstage/plugin-kubernetes-backend': minor
'@backstage/plugin-kubernetes-common': patch
---

The Kubernetes errors when fetching pod metrics are now captured and returned to the frontend.

- **BREAKING** The method `fetchPodMetricsByNamespace` in the interface `KubernetesFetcher` is changed to `fetchPodMetricsByNamespaces`. It now accepts a set of namespace strings and returns `Promise<FetchResponseWrapper>`.
- Add the `PodStatusFetchResponse` to the `FetchResponse` union type.
- Add `NOT_FOUND` to the `KubernetesErrorTypes` union type, the HTTP error with status code 404 will be mapped to this error.
