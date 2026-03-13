---
status: complete
priority: p2
issue_id: '005'
tags: [code-review, security, logging]
dependencies: []
---

# 005 — Provider `error_description` reflected in log messages without sanitization

## Problem Statement

All three token refreshers build an `Error` message directly from the provider's response body:

```typescript
throw new Error(
  `Atlassian token refresh error: ${data.error_description ?? data.error}`,
);
```

`data.error_description` is a string controlled by the remote OAuth server. It is not validated for length, character set, or content. This creates a **log injection** risk: a pathological or MITM'd response could embed newlines and JSON fragments in the error message, forging additional log entries when the error is passed to `this.logger.error(...)` in `DefaultProviderTokenService.refreshAndPersist`.

Depending on the log aggregator (Elasticsearch, Splunk, Datadog), a forged log entry could manipulate dashboards, alerts, or SIEM rules.

Currently the error is caught in `refreshAndPersist` and not propagated to callers, so external exposure is nil. But the path from provider-controlled string → logger is unguarded.

## Findings

- **`plugins/provider-token-backend-module-atlassian/src/module.ts` lines 64-67**
- **`plugins/provider-token-backend-module-github/src/module.ts` lines 69-71**
- **`plugins/provider-token-backend-module-microsoft/src/module.ts` lines 70-73**
- **`plugins/provider-token-backend/src/DefaultProviderTokenService.ts` lines 197-202**: Error message passed to `logger.error`

## Proposed Solutions

### Option A — Truncate and strip control characters (Recommended)

```typescript
const desc = String(data.error_description ?? data.error)
  .slice(0, 200)
  .replace(/[\r\n\t]/g, ' ');
throw new Error(`Atlassian token refresh error: ${desc}`);
```

- **Pros**: Simple, removes injection vector, preserves useful info
- **Effort**: Small (one guard per refresher)
- **Risk**: Low

### Option B — Use only `data.error` (the short machine-readable code)

```typescript
throw new Error(`Atlassian token refresh error: ${data.error}`);
```

`error` is typically a short OAuth error code like `"invalid_grant"` — it is effectively bounded by the spec.

- **Pros**: Even simpler; the short code is all that's needed for debugging
- **Cons**: Loses verbose description (sometimes useful for support)
- **Effort**: Minimal
- **Risk**: Low

### Option C — Parse error body into a typed interface first

Define `interface OAuthErrorResponse { error: string; error_description?: string }` and validate the parsed body against it before accessing fields.

- **Pros**: Full type safety; rejecting malformed bodies entirely
- **Cons**: More boilerplate; `response.json()` returns `any` so type assertion is nominal
- **Effort**: Small-Medium
- **Risk**: Low

## Recommended Action

_[To be filled during triage]_

## Technical Details

- **Affected files**: All 3 refresher `module.ts` files

## Acceptance Criteria

- [ ] `error_description` (or equivalent) from all 3 provider responses is sanitized before being embedded in an Error message
- [ ] Sanitization removes at minimum: `\r`, `\n`, and limits length to ≤ 200 characters
- [ ] Existing error handling tests still pass

## Work Log

- **2026-03-12**: Identified by security-sentinel (P2) in /ce:review.
