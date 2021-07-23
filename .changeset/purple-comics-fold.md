---
'@backstage/plugin-kubernetes-backend': patch
---

Add configuration option to the kubernetes object types. Config option is under `kubernetes.resources`. Defaults to ['pods', 'services', 'configmaps', 'deployments', 'replicasets', 'horizontalpodautoscalers', 'ingresses']
