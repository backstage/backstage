---
'@backstage/plugin-kubernetes-react': patch
---

Widened the `PodExtraColumn` type to accept `TableColumn<V1Pod>` in addition to `TableColumn<Pod>`, so custom columns can be authored without unsafe casts when `PodsTable` is given `V1Pod[]` data. Also fixed the `PodsTablesProps.pods` type, which incorrectly allowed a single `Pod` instead of `Pod[]`.
