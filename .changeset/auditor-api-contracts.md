---
'@backstage/backend-plugin-api': minor
---

Adds new contracts to the auditor core service.

Every audit event now carries a unique `id`, shared by all emissions (`initiated`, `succeeded`, `failed`) of the same event, so producers can reference their own events and link child events to them via `parentEventId`. Events also carry a `timestamp` recorded once at event creation, a `schemaVersion` field distinguishing the current event shape from the legacy one (which is detected by the field's absence), and the `traceId` and `spanId` of the OpenTelemetry span that was active when the event was created, when one exists, so audit trails can be joined with distributed traces.

Audit event handles can now carry metadata across the lifetime of an operation: `event.update()` merges metadata into the held event, and finalizing an event with `success` or `fail` is first-terminal-wins. The new `auditor.withEvent(options, fn)` helper wraps an entire operation: it records a successful outcome when the function resolves, and records the failure and re-throws the original error when it rejects, so callers no longer need to write the create/try/catch ceremony themselves. Events can also carry a `parentEventId` to link related events together.

The shape of the events emitted by the auditor, along with a new `AuditSink` interface for writing them to a custom destination, is now exported from this package instead of only from `@backstage/backend-defaults/auditor`. The existing exports from `@backstage/backend-defaults/auditor` continue to work. Failed events carry the failure as a plain `{ name, message, stack }` object rather than a live `Error`, so events remain serializable end to end.

Audit event handles can also be finalized directly from an Express response with `event.attachToResponse(res)`: the event succeeds when the response finishes with a status code below 400, and fails when it finishes with an error status code or the client disconnects before the response completes.

The `request` option of `createEvent` and `withEvent` now also accepts a plain request context object (`{ url, method, ip?, hostname?, userAgent? }`, exported as `AuditorEventRequestContext`) in addition to an Express request, so non-HTTP contexts such as task workers, schedulers and message consumers can record URL, method and network details. Query strings are sanitized the same way for both shapes; only Express requests trigger credential-based actor resolution. A new optional `actor` option (`AuditorEventActorDetails`) attributes an event explicitly, taking precedence over the actor derived from the request and credentials — for example a worker auditing on behalf of the user that created its task.

Note for implementers of the `AuditorService` interface: the new `update`, `withEvent` and `attachToResponse` members are required, so existing custom implementations need to add them when upgrading.
