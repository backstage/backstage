---
status: pending
priority: p2
issue_id: '014'
tags: [code-review, architecture, reliability, scalability]
dependencies: []
---

# 014 — In-memory `refreshLocks` provides no thundering-herd protection in multi-replica deployments

## Problem Statement

`DefaultProviderTokenService.refreshLocks` is an in-memory `Map<string, Promise<...>>`. It
deduplicates concurrent refresh calls for the same `userEntityRef|providerId` pair **within a
single process**. In a multi-replica deployment (two or more backend pods), each replica has its
own independent `refreshLocks` Map.

This means two replicas can simultaneously:

1. Both detect the same token is near-expiry
2. Both call `refresher.refresh(refreshToken)` with the same single-use refresh token
3. One succeeds (gets new access + refresh tokens); the other gets `invalid_grant` (token already consumed)
4. The second replica throws `OAuthPermanentError` → deletes the token row → the user's session is destroyed

This is **especially severe for Atlassian**, which always rotates the refresh token on every use.
Under normal load-balancing this race window is small, but under a thundering herd (many users with
tokens expiring simultaneously after a provider outage) it is near-certain.

## Findings

- **`plugins/provider-token-backend/src/DefaultProviderTokenService.ts` lines 31-34**: `refreshLocks` is a plain `Map` — not shared across processes
- **`plugins/provider-token-backend/src/DefaultProviderTokenService.ts` lines 112-122**: Lock is set and cleaned up only within this process — no distributed coordination
- **`plugins/provider-token-backend-module-atlassian/src/module.ts` line 110**: Atlassian always rotates refresh token — double-consumption is guaranteed invalid_grant

## Proposed Solutions

### Option A — DB-level advisory lock (preferred, simple)

Before calling `refresher.refresh()`, acquire a DB-level lock keyed on `userEntityRef|providerId`.
In SQLite: `BEGIN EXCLUSIVE`. In Postgres: `SELECT pg_advisory_xact_lock(hashtext(...))`.
This serializes refresh calls across all replicas at the cost of one extra DB round-trip per refresh.

The in-memory `refreshLocks` can stay as a first-layer dedup within a single replica (reduces DB
lock contention under concurrent requests from the same pod).

### Option B — Optimistic retry with version column

Add a `token_version` integer column. The refresh path does:

```sql
UPDATE provider_tokens SET ... WHERE user_entity_ref = ? AND provider_id = ? AND token_version = ?
```

If the UPDATE affects 0 rows (another replica already refreshed it), re-read the row and return
the freshly-written token. This avoids locking entirely at the cost of a more complex flow.

### Option C — Accept the race, tighten `OAuthPermanentError` handling

Only treat `invalid_grant` from a refresh as permanent after the row has already been updated by
another replica (detectable via `updated_at > when we read the row`). If the row is fresh, treat
the `invalid_grant` as transient and re-read the DB. This is the lowest-effort fix but is
probabilistic rather than deterministic.

## Files to Change

- `plugins/provider-token-backend/src/DefaultProviderTokenService.ts` — add distributed refresh coordination
- Migration file (if adding `token_version` column for Option B)
