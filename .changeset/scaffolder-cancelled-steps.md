---
'@backstage/plugin-scaffolder-react': patch
---

Update task and step statuses when cancellation arrives, preserving finished steps and resetting statuses when a recoverable task restarts. Cancellation remains visible until recovery, even if the aborted action later reports failure. Task status reflects the backend outcome when replaying recovery and completion events, with duplicate completion events handled without repeated status requests.
