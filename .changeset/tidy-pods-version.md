---
'@backstage/plugin-kubernetes-react': patch
---

Added a Version column to the Kubernetes pod table that displays the container image version(s), qualified by container name for multi-container pods.
Pod table columns are now extensible, allowing adopters to add custom columns in addition to the built-in presets. `PodsTable`, `PodsTablesProps` and `PodExtraColumn` are now generic over the pod row type, so `extraColumns` must match whichever of `Pod` or `V1Pod` was passed to the `pods` prop.
