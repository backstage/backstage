---
'@backstage/backend-tasks': patch
---

Scheduled tasks now have an optional `scope` field. If unset, or having the
value `'global'`, the old behavior with cross-worker locking is retained. If
having the value `'local'`, there is no coordination across workers and the
behavior is more like `setInterval`. This can be used to replace usages of
`runPeriodically` helpers.
