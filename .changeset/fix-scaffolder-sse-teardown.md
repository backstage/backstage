---
'@backstage/plugin-scaffolder-common': patch
---

Fixed a connection leak in the scaffolder event stream where unsubscribing did not abort the underlying SSE connection. Also changed unexpected server disconnects to signal an error instead of silently completing, enabling consumers to retry.
