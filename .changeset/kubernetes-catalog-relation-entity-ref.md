---
'@backstage/plugin-kubernetes-backend': patch
'@backstage/plugin-kubernetes-node': patch
---

Fixed the `catalogRelation` service locator to match clusters whose `kubernetes-cluster` resource lives in a different namespace than the component, and to disambiguate clusters that share the same name. Clusters not sourced from the catalog keep the previous name-based matching. `ClusterDetails` gains an optional `entityRef` field carrying the source cluster resource's entity ref when sourced from the catalog.
