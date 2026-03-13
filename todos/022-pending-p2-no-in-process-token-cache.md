---
status: pending
priority: p2
issue_id: '022'
tags: [code-review, performance, scalability]
dependencies: []
---

# 022 — No in-process token cache: one DB query per action invocation on every call

## Problem Statement

Every Jira action call invokes `tokenService.getToken()`, which unconditionally issues a DB
`SELECT` before making the Jira API request. For a user running several Jira actions in a
typical MCP session (e.g., `getIssue` + `searchIssues` + `addComment`), this means 3 DB
round-trips to retrieve the same token row that hasn't changed between calls.

The `expires_at` field in the DB row determines whether to refresh. For a token with 30+ minutes
remaining, the row content is identical across multiple reads within the same session. There is
no benefit to re-reading it every time.

Additional hot-path cost: every non-refresh `getToken` call also:

1. Decrypts `access_token` via AES-256-GCM (~5-15 µs synchronous CPU)
2. Decrypts `scope` via AES-256-GCM (even though no action currently uses scope)
3. Calls `logger.info(...)` which involves string formatting and I/O

At 100+ concurrent action invocations, DB connection pool exhaustion adds queuing latency
on top of the query itself.

## Findings

- **`plugins/provider-token-backend/src/DefaultProviderTokenService.ts` line 84**: Unconditional `this.db('provider_tokens').where(...).first()` on every `getToken` call
- **`plugins/provider-token-backend/src/DefaultProviderTokenService.ts` line 139**: `logger.info('Provider token retrieved', ...)` — logs every successful read (should be `debug`)

## Proposed Solution

Add a short-lived in-process LRU cache with TTL. The cache stores the decrypted `ProviderToken`
object; on cache hit, no DB query is needed:

```typescript
import LRUCache from 'lru-cache';

// In DefaultProviderTokenService constructor:
private readonly tokenCache = new LRUCache<string, ProviderToken>({
  max: 1000,           // max 1000 entries (bounded by user × provider count)
  ttl: 30_000,         // 30-second TTL — well under the 300s refresh buffer default
});

async getToken(userEntityRef, providerId): Promise<ProviderToken | undefined> {
  const cacheKey = `${userEntityRef}|${providerId}`;
  const cached = this.tokenCache.get(cacheKey);
  if (cached) return cached;

  // ... existing DB query and logic ...

  // Cache the result (only when not near-expiry to avoid serving stale tokens)
  if (!isNearExpiry) {
    this.tokenCache.set(cacheKey, token);
  }
  return token;
}
```

Cache invalidation:

- `upsertToken(userEntityRef, providerId)` must call `this.tokenCache.delete(cacheKey)` to evict the stale entry after a sign-in or refresh writes new token data.
- `deleteToken(userEntityRef, providerId)` must also call `this.tokenCache.delete(cacheKey)`.

**Note:** 30-second cache TTL means a sign-in from one process takes up to 30 seconds to be
visible from another replica's cache (but the DB row is always fresh). This is acceptable
for OAuth tokens with multi-hour lifetimes.

Separately (quick win): downgrade `logger.info('Provider token retrieved', ...)` to
`logger.debug(...)` to remove log-level I/O from the hot path.

## Files to Change

- `plugins/provider-token-backend/src/DefaultProviderTokenService.ts` — add LRU cache + invalidation
- `plugins/provider-token-backend/package.json` — add `lru-cache` dependency (check if already transitive)
