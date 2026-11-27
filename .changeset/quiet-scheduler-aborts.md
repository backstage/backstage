---
'@backstage/backend-defaults': patch
---

The scheduler now reports task runs that it aborted according to why it aborted them, instead of treating every error thrown after an abort as a task failure:

- Runs stopped by a shutdown or a cancellation are no longer logged as errors. Runs stopped by a shutdown are no longer recorded as failed, and cancelled runs are recorded with a cancellation error, for both local and distributed tasks.
- Runs that time out are logged as a warning and recorded with a timeout error. This now also applies to tasks that ignore the abort signal and finish after their timeout, which were previously reported as successful.
- Task metrics use a new `aborted` result for runs stopped by a shutdown or a cancellation.
- Task timeouts longer than about 24 days no longer abort the task almost immediately.
