---
'@backstage/plugin-kubernetes-backend': minor
---

Added audit logging for kubernetes-backend routes. The plugin now emits auditor events for cluster list, cluster proxy, entity workload queries, custom resource queries, and the deprecated services endpoint. Administrators can filter audit logs by `eventId` values `cluster-fetch` and `resource-fetch`, and by `queryType` in event metadata.

**BREAKING**: `KubernetesProxyOptions` now requires `AuditorService`.
