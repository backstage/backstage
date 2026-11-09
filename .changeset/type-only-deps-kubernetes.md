---
'@backstage/plugin-kubernetes-common': patch
'@backstage/plugin-kubernetes-cluster': patch
---

Moved `kubernetes-models` and `@kubernetes-models/apimachinery` to dev dependencies, since they are only used for types. Backends no longer install `kubernetes-models` through `@backstage/plugin-kubernetes-common`.
