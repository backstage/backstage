---
'@backstage/backend-tasks': patch
---

Fixed the `initialDelay` parameter of tasks to properly make task workers
_always_ wait before the first invocations on startup, not just the very first
time that the task is ever created. This behavior is more in line with
expectations. Callers to not need to update their code.

Also clarified in the doc comment for the field that this wait applies only on
an individual worker level. That is, if you have a cluster of workers then each
individual machine may postpone its first task invocation by the given amount of
time to leave room for the service to settle, but _other_ workers may still
continue to invoke the task on the regular cadence in the meantime.
