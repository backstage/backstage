---
id: auditor
title: Auditor Service
sidebar_label: Auditor
description: Documentation for the Auditor service
---

## Overview

This document describes the Auditor Service, a core service designed to record and report on security-relevant events within an application. By default, audit events are written to the root logger, marked with `isAuditEvent`, with severity levels mapped to log levels.

## Key Features

- Provides a standardized way to capture security events.
- Allows categorization of events by severity level.
- Supports detailed metadata for each event.
- Offers success/failure reporting for events, including automatic finalization from an Express response.
- Integrates with authentication and plugin services for enhanced context.
- Supports custom audit sinks for delivering events to additional destinations.

## How it Works

The default implementation of the `AuditorService` interface is `DefaultAuditorService`, provided by the `auditorServiceFactory` from `@backstage/backend-defaults/auditor`. Events pass through an internal pipeline that sanitizes the request URL, redacts sensitive metadata keys, and truncates long metadata strings, before they are written to every registered audit sink.

Sinks implement the `AuditSink` interface. The default sink logs events through the root logger, and additional sinks can be registered as backend modules through the `auditSinksServiceRef` service reference (see [adding a custom audit sink](#adding-a-custom-audit-sink)). All sinks receive every event in parallel, and a failing sink is reported without blocking the others.

The actor of each event is derived from the request credentials where an Express request is available, and from the plugin's own service credentials otherwise. Explicit actor attribution and non-HTTP request contexts are also supported (see [using the service](#using-the-service)).

## Event Lifecycle

Every audit event carries a unique `id`, shared by all emissions (`initiated`, `succeeded`, `failed`) of that event, so events can reference each other through `parentEventId`.

An event is finalized exactly once: only the first terminal call — `success`, `fail`, or `attachToResponse` settling the response — takes effect, and later calls are no-ops. Terminal calls never reject: if the audit trail can't be written, the failure is reported to the service instead of breaking the audited operation. Failed events carry the error as a plain `{ name, message, stack }` object, so events remain serializable end to end.

Every event also carries a `schemaVersion` field. Version 1 is the legacy shape emitted before the field existed, which sinks detect by its absence; version 2 is the current shape, including the event `id`, `timestamp`, `traceId`/`spanId`, `parentEventId`, the serializable error shape, and `responseStatus` metadata.

### Delivery Semantics

`withEvent` and manual `success`/`fail` calls await their terminal emission before returning, so the record is flushed before the audited operation continues. `attachToResponse` is different by design: the response has already finished when the event finalizes, so the emission is fire-and-forget — a process crash in that window can lose the record for an already-completed action. This is the current contract.

## Usage Guidance

The Auditor Service is designed for recording security-relevant events that require special attention or are subject to compliance regulations. These events often involve actions like:

- User session management
- Data access and modification
- System configuration changes

For general application logging that is not security-critical, you should use the standard `LoggerService` provided by Backstage. This helps to keep your audit logs focused and relevant.

## Using the Service

The Auditor Service can be accessed via dependency injection in your Backstage plugin. For an operation with a clear success or failure outcome, `withEvent` records the outcome for you: the event is created up front, succeeded when the function resolves, and failed — with the original error re-thrown — when it rejects.

```typescript
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { auditor } = options;

  const router = Router();
  router.use(express.json());

  router.post('/my-endpoint', async (req, res) => {
    await auditor.withEvent(
      {
        eventId: 'my-endpoint-call',
        request: req,
        meta: {
          // ... metadata about the request
        },
      },
      async event => {
        // ... process the request; call event.update() to add metadata
        // mid-flight
        res.status(200).json({ message: 'Succeeded!' });
      },
    );
  });

  return router;
}
```

For request handlers, the event can also finalize itself from the Express response with `attachToResponse`: it succeeds when the response finishes with a status code below 400, and fails when the response finishes with an error status or the client disconnects before the response completes. The status code is recorded as the `responseStatus` metadata.

```typescript
const auditorEvent = await auditor.createEvent({
  eventId: 'my-endpoint-call',
  request: req,
});
auditorEvent.attachToResponse(res);
// ... process the request and send the response
```

For finer control, keep the handle returned by `createEvent` and call `success` or `fail` yourself. Metadata can be merged into the event while it is in flight with `event.update(meta)`, and only the first terminal call takes effect.

### Non-HTTP Contexts

In contexts without an Express request, such as task workers, schedulers, and message consumers, the `request` option accepts a plain request context instead, and the event can be attributed to a specific user with the `actor` option:

```typescript
await auditor.withEvent(
  {
    eventId: 'task-run',
    request: { url: '/tasks/42', method: 'POST' },
    actor: { actorId: task.createdBy },
    meta: { taskId: '42' },
  },
  async () => {
    // ... run the task on behalf of task.createdBy
  },
);
```

The `actor` fields take precedence over the actor derived from the request and credentials. A plain request context does not trigger credential resolution, and its URL query string is stripped before the event is emitted, just like for Express requests.

## Adding a Custom Audit Sink

Audit events can be delivered to additional destinations — a database, a SIEM, a message queue — by registering an `AuditSink` implementation for the `auditSinksServiceRef` service reference. All registered sinks receive every audit event in parallel, and a failing sink never blocks the others.

```typescript
import {
  createBackendModule,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { auditSinksServiceRef } from '@backstage/backend-defaults/auditor';

export const myAuditSinkModule = createBackendModule({
  pluginId: 'app',
  register(reg) {
    reg.registerService(
      createServiceFactory({
        service: auditSinksServiceRef,
        deps: {},
        async factory() {
          return {
            write: async event => {
              await persistEvent(event);
            },
          };
        },
      }),
    );
  },
});
```

## Naming Conventions

When defining audit events, follow these guidelines to ensure consistency and clarity:

- **Use kebab-case:** Event IDs should be in kebab-case (e.g., `user-session`, `file-download`, `entity-fetch`).
- **`eventId` for Logical Grouping:** The `eventId` represents a broad category or logical group of related operations. For example, `entity-fetch` would group all entity retrieval events. `location-mutate` would group all actions that mutate a location.
- **`meta.queryType` (or related field) for Specific Actions within a Group:** Use a `meta` field (like `queryType`, `actionType` or similar) to specify the particular action or query that occurred within the broader `eventId` group.
  - For instance, with `eventId: entity-fetch`, use `meta: { queryType: 'by-id' }` to represent fetching an entity by its ID. Other examples could be:
    - `meta: { queryType: 'all' }` for fetching all entities.
    - `meta: { queryType: 'by-query' }` for fetching entities by a query.
    - `meta: { actionType: 'delete' }` for `eventId: entity-mutate` when an entity was deleted.
    - `meta: { actionType: 'create' }` for `eventId: location-mutate` when a location was added.
  - Use `meta` fields to add more context to the event being tracked.
- **Avoid Redundant Prefixes:** Do not include redundant prefixes related to the plugin ID in your event names. The plugin context is already provided separately.
- **Clear and Concise:** Choose names that clearly and concisely describe the event being audited.

## Common Meta Keys and Values

The following table details common keys found within the `meta` object of audit events and their formats:

| Key           | Description                                                                    | Format                                | Example(s)                                                                |
| ------------- | ------------------------------------------------------------------------------ | ------------------------------------- | ------------------------------------------------------------------------- |
| `queryType`   | Specifies the type of query performed when fetching data.                      | A kebab-case string                   | `all`, `by-id`, `by-name`, `by-query`, `by-refs`, `ancestry`, `by-entity` |
| `actionType`  | Specifies the type of action performed when modifying data.                    | A kebab-case string                   | `create`, `delete`, `refresh`                                             |
| `entityRef`   | The full reference of an entity, including kind, namespace, and name.          | `[kind]:[namespace]/[name]`           | `component:default/my-component`, `group:my-org/team-a`                   |
| `locationRef` | A specific reference to a location being operated on.                          | Any string representing the location. | `url:https://example.com/catalog-info.yaml`, `custom:default/my-location` |
| `uid`         | The unique identifier of a location or other object involved in the operation. | Any valid unique ID string            | `9a4e740b-e557-427f-b9f2-0d4f092b1c1e`                                    |

By following these conventions, you create a more structured and informative audit trail that is easier to search, filter, and understand. This allows you to better group and understand the events being logged.

## Audit Event Examples

To illustrate how these naming conventions and the meta field are used in practice, the following examples demonstrate typical audit events for common operations.

**Typical Read Operation Example:**

For an operation that fetches all entities, a typical audit event would look like this:

```json
{
  "eventId": "entity-fetch",
  "meta": {
    "queryType": "all"
  }
  ...
}
```

**Typical Write Operation Example:**

For an operation that deletes an entity, a typical audit event would look like this:

```json
{
  "eventId": "entity-mutate",
  "meta": {
    "actionType": "delete",
    "uid": "some-entity-uid",
    "entityRef": "component:default/petstore"
  },
  "severityLevel": "medium"
  ...
}
```

## Practical Examples for Auditor Implementation

To clarify how to utilize the Auditor feature effectively, we recommend exploring the Catalog Backend. It offers two valuable resources:

- **Code Implementation Example (createRouter.ts):**
  - The [`createRouter.ts`](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend/src/service/createRouter.ts) file within the Catalog Backend showcases a practical integration of the `AuditorService` within a Backstage backend plugin.
  - Specifically, the lines that demonstrate the creation of an audit event. This includes setting critical parameters such as `eventId` and `severityLevel`, as well as incorporating relevant metadata like `queryType` and `entityRef`.
- **Documentation Example:**
  - The "Audit Events" section of the Software Catalog [Audit Documentation](../../features/software-catalog/audit-events.md) provides a well-structured example of documenting emitted audit events.
  - It illustrates how to detail various `eventId` values and their corresponding `meta` fields (e.g., `queryType`, `actionType`) for different plugin operations.

Sinks should treat the audit trail as append-only: events are records of things that happened, and updating or deleting them is outside the audit contract. How long events are retained, and how they are expired or archived, belongs to the sink's domain — the auditor service makes no retention decisions.

These examples provide both a code-level demonstration and a documentation guideline for effectively utilizing the `AuditorService` to manage audit events within your Backstage plugins.

## Trace Correlation

When an [OpenTelemetry](https://opentelemetry.io/) span is active while an audit event is created, the event automatically carries the span's `traceId` and `spanId`, and the same values are kept across all emissions of the event. This lets audit trails be joined with distributed traces without any extra wiring. When no span is active, the fields are simply absent. The explicit `parentEventId` option remains available for manual linkage between audit events.

## Severity Log Level Mappings

The Auditor Service provides a way for plugins to log significant events, categorized by their severity. The `severityLogLevelMappings` configuration option enables you to customize how these severity levels are mapped to actual log levels within your Backstage backend, giving you precise control over the verbosity of your audit logs.

### Configuration

The `severityLogLevelMappings` are configured under the `backend.auditor` section of your `app-config.yaml` file. This structure allows you to specify the log level for each severity level supported by the Auditor Service. You can override individual severity levels without changing the entire mapping.

Example configuration:

```yaml
backend:
  auditor:
    severityLogLevelMappings:
      low: debug
      medium: info
      high: warn
      critical: error
```

### Severity Levels and Default Mappings

The Auditor Service supports the following severity levels:

- `low`: Represents low-importance events, typically informational or debug-level.
- `medium`: Represents events of moderate importance, requiring some attention.
- `high`: Represents high-importance events, potentially indicating a problem or security issue.
- `critical`: Represents critical events, requiring immediate attention.

By default, these severity levels are mapped to the following log levels:

- `low`: `debug`
- `medium`: `info`
- `high`: `info`
- `critical`: `info`

As a result, medium, high, and critical events are logged as info-level events by default, while low-level events are treated as debug.

## Event Hygiene and Sampling

Before an audit event is written to a sink, the auditor service sanitizes it and can sample high-volume events down. These controls are configured under the `backend.auditor` section of your `app-config.yaml` file.

```yaml
backend:
  auditor:
    # Strip query strings from request URLs, so credentials passed in the
    # URL don't end up in the audit trail. Defaults to true.
    sanitizeRequestQuery: true
    # Maximum length of string values in event metadata; longer strings are
    # truncated. Use -1 to disable. Defaults to 4096.
    maxMetaStringLength: 4096
    # Additional metadata keys whose values are redacted to `[REDACTED]`,
    # on top of the default denylist of token, password, secret,
    # authorization and cookie. Matching is case-insensitive and recursive.
    # An empty array disables redaction entirely.
    redactMetaKeys: []
    # Optional per-severity sampling probabilities between 0 and 1. Severity
    # levels without a probability are always emitted. A probability of 0
    # drops all events of that severity; the critical severity must use a
    # probability greater than 0, so critical audit events can never be
    # sampled away entirely.
    sampling:
      low: 0.1
```

An invalid `sampling.critical` value of `0` is rejected with a configuration error at startup. Sampled-out events keep their full handle semantics — `createEvent` still returns a usable event and `withEvent` still runs the wrapped function — only the emissions are dropped.
