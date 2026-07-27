# Usage analytics backend

The backend stores sanitized usage events and ephemeral online presence in two
database tables. Reports are calculated on demand without queues or aggregate
tables.

```ts
backend.add(import('@backstage/plugin-usage-analytics-backend'));
```

PostgreSQL is recommended for production. SQLite is supported for local
development and tests.

```yaml
usageAnalytics:
  retention:
    eventsDays: 90
    presenceHours: 24
  export:
    maxConcurrent: 2
    timeoutSeconds: 300
```

The plugin registers `usage-analytics.aggregates.read` and
`usage-analytics.details.read`. Writes require an authenticated user, while
detailed reports require the latter permission.

An online user has sent a heartbeat in the last 90 seconds. Background tabs
remain online while they continue to communicate with Backstage. Session
summaries and timelines use the complete event history.

## CSV exports

Send a `POST` request to `/api/usage-analytics/v1/export` to download one
complete dataset. The request body must include `dataset` with the value
`activity` or `pages`. It may also include `from`, `to`, `userEntityRef`,
`path`, and `pluginId`. Activity exports additionally accept `action`; page
exports accept only an omitted action or `action: navigate`.

```json
{
  "dataset": "activity",
  "from": "2026-07-01T00:00:00.000Z",
  "to": "2026-08-01T00:00:00.000Z",
  "action": "navigate"
}
```

```json
{
  "dataset": "pages",
  "from": "2026-07-01T00:00:00.000Z",
  "to": "2026-08-01T00:00:00.000Z",
  "pluginId": "catalog"
}
```

The range is inclusive at `from` and exclusive at `to`. It defaults to the
previous 30 days and cannot exceed 365 days. Filters use exact matches.
Pagination and custom sorting fields are not accepted.

Activity exports require `usage-analytics.details.read`. Page exports require
`usage-analytics.aggregates.read`, unless `userEntityRef` is present, in which
case they require `usage-analytics.details.read`.

### Wire contract

Activity columns are emitted in this order:

```text
eventId,occurredAt,userEntityRef,sessionId,action,subject,value,pluginId,extensionId,currentPath,previousPath
```

Activity rows are ordered by `occurredAt` ascending and then `eventId`
ascending.

Page columns are emitted in this order:

```text
path,pageViews,uniqueUsers,estimatedDurationSeconds,lastViewedAt
```

Page rows are ordered by `pageViews` descending and then path in binary UTF-8
byte order. The binary tie-breaker is part of the `/v1` contract.

CSV output uses UTF-8 without a byte-order mark, comma delimiters, and LF record
delimiters. Timestamps use UTC ISO 8601. Counts are base-10 integers, while
durations and event values are unlocalized numbers. Empty optional cells mean
that the value is absent; `null`, `undefined`, and an empty string are
intentionally equivalent.

To protect spreadsheet users while preserving exact non-empty strings, the
export prefixes one apostrophe when a value:

- starts with an apostrophe, tab, carriage return, or line feed; or
- has zero or more leading tabs, carriage returns, line feeds, or ASCII spaces
  followed by `=`, `+`, `-`, or `@`.

A machine consumer decodes a value only when the suffix after its first
apostrophe matches the same rule. It then removes exactly that first
apostrophe. This makes the transformation reversible even when the original
value begins with one or more apostrophes.

An empty result still contains the selected dataset's header row. Each export
observes the database snapshot established by its one statement; events
committed after that snapshot are not included.

### Operations and security

PostgreSQL streams export rows through a database cursor and is the supported
production path for bounded application memory. SQLite produces the same
values and ordering, but its driver may materialize the statement result; use
it only for local development and tests.

The backend allows two concurrent exports per instance and applies a
five-minute deadline by default. Tune `maxConcurrent` to the database pool and
`timeoutSeconds` to observed export duration. Requests above the limit receive
`429` immediately. A timeout or disconnected client cancels delivery and
releases the slot. A failure after CSV streaming begins leaves an incomplete
download, which callers must discard.

Every valid export attempt creates a native audit event. Plugin-supplied audit
metadata contains only the dataset, normalized range, applied filter names,
outcome, and emitted row count. It never contains filter values or CSV cells.
Custom auditor implementations are responsible for not persisting arbitrary
request bodies.

Activity exports contain sensitive behavioral data. Operators must define
appropriate storage, retention, and sharing policies for downloaded files.
