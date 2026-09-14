---
'@backstage/plugin-kubernetes-common': patch
'@backstage/plugin-kubernetes-node': patch
'@backstage/plugin-kubernetes-backend': patch
---

Add `KubernetesWatcher` interface for streaming Kubernetes resource changes via an async iterator. The watcher is separated from `KubernetesFetcher` because watching is a long-lived streaming connection that only works with server-side auth providers. Watch supports all event types (ADDED, MODIFIED, DELETED, BOOKMARK, ERROR) with errors yielded as data rather than thrown.
