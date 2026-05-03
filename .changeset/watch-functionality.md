---
'@backstage/plugin-kubernetes-common': patch
'@backstage/plugin-kubernetes-node': patch
'@backstage/plugin-kubernetes-backend': patch
---

Add watch functionality to Kubernetes plugin REST client. The `watchResource()` method provides an async iterator interface for streaming resource changes from the Kubernetes API, supporting all event types (ADDED, MODIFIED, DELETED, BOOKMARK, ERROR) with the same error handling patterns as existing get/list operations.
