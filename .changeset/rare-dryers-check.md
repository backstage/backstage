---
'@backstage/plugin-kubernetes-backend': minor
---

**BREAKING**: The `KubernetesBuilder.createBuilder` method now requires the `discovery` service to be forwarded from the plugin environment. This is part of the migration to support new auth services.
