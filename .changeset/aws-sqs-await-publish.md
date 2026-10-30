---
'@backstage/plugin-events-backend-module-aws-sqs': patch
---

`AwsSqsConsumingEventPublisher` now awaits publishing each received message and only deletes the messages that were published successfully. Previously a failed publish, for example `Service is shutting down` during a graceful shutdown, caused an unhandled rejection while the message was still deleted from the queue, so the event was lost. Failed messages are now left on the queue and redelivered after the visibility timeout.
