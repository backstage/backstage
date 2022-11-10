---
'@backstage/plugin-kubernetes-backend': minor
'@backstage/plugin-kubernetes-common': minor
---

**BREAKING** The buildRouter method now takes an additional parameter of type PermissionEvaluator that **must** be passed when calling this method now.
The Kubernetes Builder service now makes use of a Permission Evaluator field which was introduced to the KubernetesEnvironment interface and subsequently used throughout the builder.
The kubernetes router /clusters, /workload, and /customresources endpoint now makes a call to a PermissionApi before returning any Json.
