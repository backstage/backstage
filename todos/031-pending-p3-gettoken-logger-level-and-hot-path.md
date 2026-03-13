---
status: completed
priority: p3
issue_id: '031'
tags: [code-review, performance, observability]
dependencies: []
---

# 031 — `logger.info` on every successful `getToken` call — remove PII from hot path logs

## Problem Statement

`DefaultProviderTokenService.getToken()` emits a `logger.info` log on every successful non-refresh
token read:

```typescript
this.logger.info('Provider token retrieved', {
  userEntityRef,
  providerId,
  hasRefreshToken,
  expiresAt: expiresAt?.toISOString() ?? 'none',
});
```

This log fires on every action invocation. For a team of 50 users each making 10 action calls
per day, this generates 500 structured log lines per day containing `userEntityRef` (PII — the
user's catalog entity reference, which maps directly to their identity). At 1,000 users × 100
calls/day, it is 100,000 PII-bearing log lines per day.

`logger.info` is typically included in production log aggregation pipelines. Emitting PII at
`info` level means user identity data flows into Datadog, Splunk, CloudWatch, or whatever sink
is configured — potentially with long retention periods and broad access.

Additionally, logging on the hot path (every read, not just state changes) provides minimal
operational value — operators already know when things break (via `logger.warn`/`logger.error`
calls in the same file). Successful reads at scale don't require individual log lines.

## Findings

- **`plugins/provider-token-backend/src/DefaultProviderTokenService.ts` lines 136-141**: `logger.info('Provider token retrieved', { userEntityRef, ... })` on every non-refresh read

## Proposed Solution

Downgrade to `logger.debug`:

```typescript
this.logger.debug('Provider token retrieved', {
  userEntityRef,
  providerId,
  hasRefreshToken,
  expiresAt: expiresAt?.toISOString() ?? 'none',
});
```

`debug` level is excluded from most production log aggregation pipelines, keeping PII out of
long-retention sinks. Operators can enable debug logging temporarily for specific investigations.

The existing `logger.info` calls for state changes (upsert, refresh, delete, error) should remain
at `info` level — those represent meaningful events worth tracking in production.

## Files to Change

- `plugins/provider-token-backend/src/DefaultProviderTokenService.ts` — change `info` to `debug` on line 137
