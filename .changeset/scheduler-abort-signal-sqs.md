---
'@backstage/plugin-events-backend-module-aws-sqs': patch
---

The AWS SQS event consumer now stops polling when the scheduler aborts the task, for example when the backend shuts down, instead of waiting for the current receive call or idle wait to finish.
