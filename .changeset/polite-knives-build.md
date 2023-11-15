---
'@backstage/plugin-kubernetes-backend': minor
---

You can now select `single` kubernetes cluster that the entity is part-of from all your defined kubernetes clusters, by passing `backstage.io/kubernetes-cluster` annotation with the defined cluster name.

If you do not specify the annotation by `default it fetches all` defined kubernetes cluster.

To apply

catalog-info.yaml

```diff
annotations:
  'backstage.io/kubernetes-id': dice-roller
  'backstage.io/kubernetes-namespace': dice-space
+ 'backstage.io/kubernetes-cluster': dice-cluster
  'backstage.io/kubernetes-label-selector': 'app=my-app,component=front-end'
```
