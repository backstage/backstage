---
'@backstage/plugin-kubernetes-backend': minor
'@backstage/plugin-kubernetes-node': patch
---

**BREAKING**: The `catalogRelation` service locator now matches catalog-sourced clusters by the full entity ref of their `kubernetes-cluster` resource, instead of assuming the resource lives in the component's namespace. This fixes clusters in other namespaces not being found and same-named clusters being mixed up.

This only affects components whose `dependsOn` relation points to a cluster in a different namespace using a short ref, for example `resource:prod` from a component in `team-a` for a cluster in `default`. Update these to the full ref, such as `resource:default/prod`. Setups where components and clusters share a namespace, including everything in `default`, and clusters not sourced from the catalog are unaffected.

`ClusterDetails` gains an optional `entityRef` field.
