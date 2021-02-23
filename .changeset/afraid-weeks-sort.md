---
'@backstage/plugin-kubernetes': patch
---

k8s plugin now surfaces k8s components with only label selector query annotation.
Previously backstage.io/kubernetes-label-selector catalog entity annotation would only work if you also included backstage.io/kubernetes-id.
But backstage.io/kubernetes-id value was ignored
