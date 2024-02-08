---
'@backstage/plugin-kubernetes-react': minor
---

**BREAKING** The `PodScope`, `PodAndErrors`, and `PodExecTerminalProps` types no
longer have a `clusterName` field; instead they now have the field `cluster`
which contains the full `ClusterAttributes`.
