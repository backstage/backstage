---
'@backstage/backend-defaults': patch
---

The scheduler now reports task runs that it aborted according to why it aborted them, instead of treating every error thrown after an abort as a task failure. Runs stopped by a shutdown are no longer logged as errors or recorded as failed runs. Runs that time out are logged as a warning and recorded with a timeout error. Runs taken over by another host, for example after being cancelled, are not logged or counted as failures. Task metrics use a new `aborted` result for shutdowns and takeovers.
