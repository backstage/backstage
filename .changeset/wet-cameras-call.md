---
'@backstage/plugin-kubernetes-backend': minor
'@backstage/plugin-kubernetes-common': minor
---

The Kubernetes errors when fetching pod metrics are now captured and returned to the frontend.

Include the `PodStatusFetchResponse` into the `FetchResponse` union type. Now the method `fetchPodMetricsByNamespaces` accepts a set of namespaces and returns a `FetchResponseWrapper`, just like other public fetch methods in the fetcher.
