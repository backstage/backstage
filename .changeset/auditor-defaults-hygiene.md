---
'@backstage/backend-defaults': patch
---

Improves the default auditor service.

Adds a new `auditSinksServiceRef` that lets additional audit destinations be registered as backend modules without replacing the auditor factory. All registered sinks receive every audit event in parallel, and a failing sink is reported without blocking the other sinks. The default sink writes events to the root logger.

Finalizing an audit event (`success`/`fail`) no longer rejects when the audit trail can't be written; such failures are logged by the service instead of breaking the audited request, and only the first terminal call for an event takes effect.

Events are now sanitized before they are written: query strings are stripped from request URLs (disable with `backend.auditor.sanitizeRequestQuery: false`), sensitive metadata keys such as `token`, `password`, `secret`, `authorization` and `cookie` are redacted (extend or disable via `backend.auditor.redactMetaKeys`), and long string values are truncated (configured via `backend.auditor.maxMetaStringLength`, `-1` disables). High-volume events can be sampled down per severity level with `backend.auditor.sampling`; sampling all `critical` events away is rejected as invalid configuration.
These controls also apply to the `WinstonRootAuditorService` root auditor. Audit events automatically carry the `traceId` and `spanId` of the OpenTelemetry span that is active when the event is created, when one exists, so audit trails can be joined with distributed traces.
