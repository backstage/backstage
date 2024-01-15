---
'@backstage/plugin-events-backend-module-aws-sqs': patch
---

Fix errors when deleting SQS messages:

- If zero messages were received, skip deletion to avoid `EmptyBatchRequest` error from the SQS client.
- If zero failures were returned from the SQS client during deletion, skip error logging.
