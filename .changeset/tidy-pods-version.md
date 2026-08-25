---
'@backstage/plugin-kubernetes-react': patch
---

Added a Version column to the Kubernetes pod table that displays the container image version.
Pod table columns are now extensible, allowing adopters to add custom columns in addition to the built-in presets. The `PodExtraColumn` type accepts `TableColumn<V1Pod>` in addition to `TableColumn<Pod>`, so custom columns can be authored without unsafe casts when `PodsTable` is given `V1Pod[]` data.
