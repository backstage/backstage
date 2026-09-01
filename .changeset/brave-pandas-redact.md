---
'@backstage/plugin-scaffolder-backend': minor
---

Added task-scoped secret redaction across Scaffolder logs, events, errors, audit records, dry-run results, and task projections. Each execution attempt combines current system and environment secrets with task secrets and sensitive values learned during rendering or restored during recovery.

Retries and recoveries create a fresh redactor from the secrets available to that attempt. Sensitive keys and values in restored checkpoint and step-output payloads are added before the state is used, without introducing a separate database history of exact secret values.

Custom task brokers must return public task and event projections with task-local sensitive values redacted. The built-in database store redacts observable event data before it is written and removes secret-matching values from the stored task specification when its task-secret source is cleared.

Redaction sets are bounded to protect the service from excessive matching work. Attempts that exceed the bound fail closed by broadly redacting later outward projections. Direct `DatabaseTaskStore` integrations that publish task events must supply a live system secret source; task events are suppressed when that source is unavailable.

The `scaffolder.task` event payload no longer includes recovery `state`. Its task `spec` is retained for compatibility but is redacted before publication. Event consumers that need recovery details must fetch the authorized task API instead.
