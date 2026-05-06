---
'@backstage/plugin-kubernetes-react': patch
---

Added optional clustersCacheTtlMs option to KubernetesBackendClient that caches getClusters() responses for the specified duration, avoiding repeated /clusters requests when multiple proxy calls resolve cluster auth in quick succession.
