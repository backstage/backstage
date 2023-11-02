---
'@backstage/plugin-kubernetes-backend': minor
---

**BREAKING** You can now filter `single` or `multiple kubernetes cluster` that the entity is part-of from all your defined kubernets clusters, by passing `backstage.io/kubernetes-clusters` annotation with the defined cluster name.

If you dont specify the annotation by `default it fetches all` the defined kubernetes cluster.

To apply `single cluster filter`. Specify the cluster name

```diff
annotations:
  'backstage.io/kubernetes-id': dice-roller
  'backstage.io/kubernetes-namespace': dice-space
+ 'backstage.io/kubernetes-clusters': dice-cluster
  'backstage.io/kubernetes-label-selector': 'app=my-app,component=front-end'
```

To apply `multiple cluster filter`. Specify `comma(,)` seprated clusters name.

```diff
annotations:
  'backstage.io/kubernetes-id': dice-roller
  'backstage.io/kubernetes-namespace': dice-space
+ 'backstage.io/kubernetes-clusters': 'dice-cluster,roller-cluster'
  'backstage.io/kubernetes-label-selector': 'app=my-app,component=backend-end'
```
