---
'@backstage/plugin-kubernetes-backend': minor
---

Add support for Kubernetes clusters in the catalog.

The KubernetesBuilder.createBuilder method now requires an additional field,
discovery. To update your backend, you will want to do something like the following:

```javascript
KubernetesBuilder.createBuilder({
   config: env.config,
   logger: env.config,
   discovery: env.discovery,
 })
```
