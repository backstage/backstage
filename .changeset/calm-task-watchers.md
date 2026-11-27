---
'@backstage/plugin-scaffolder-backend': patch
---

Stop the cancellation watcher when its worker finishes a task run or loses its heartbeat, including recoverable tasks. Keep retry cancellation working even when old completion events are replayed.
