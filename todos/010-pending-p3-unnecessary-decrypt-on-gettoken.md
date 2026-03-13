---
status: complete
priority: p3
issue_id: '010'
tags: [code-review, performance, quality]
dependencies: []
---

# 010 — Unnecessary `decrypt(refresh_token)` on every `getToken` call

## Problem Statement

In `DefaultProviderTokenService.getToken`, the refresh token is decrypted on every call to check if one exists:

```typescript
// Line 113-115
const refreshToken = row.refresh_token
  ? decrypt(row.refresh_token, this.encKey)
  : undefined;

if (isNearExpiry && refreshToken) {
  /* use it */
}
```

The presence check (`row.refresh_token ? ... : undefined`) does NOT require decryption — a `null` check on the raw encrypted value is sufficient. AES-256-GCM decryption involves buffer allocation, hex parsing, cipher initialization, and GCM authentication tag verification. On a hot `getToken` path (many requests for valid, non-expiring tokens), this is wasted CPU and allocation work.

The refresh token plaintext is only needed in the `isNearExpiry && hasRefreshToken` branch.

## Findings

- **`plugins/provider-token-backend/src/DefaultProviderTokenService.ts` lines 113-131**
- Performance-oracle flagged as P2-C; downgraded to P3 as the hot path impact depends on token lifetime

## Proposed Solutions

### Fix — Defer decrypt to where it's needed

```typescript
const hasRefreshToken = !!row.refresh_token;

if (isNearExpiry && hasRefreshToken) {
  const refreshToken = decrypt(row.refresh_token!, this.encKey);
  const lockKey = `${userEntityRef}|${providerId}`;
  let refreshPromise = this.refreshLocks.get(lockKey);
  if (!refreshPromise) {
    refreshPromise = this.refreshAndPersist(userEntityRef, providerId, refreshToken, row.scope)
      .finally(() => this.refreshLocks.delete(lockKey));
    this.refreshLocks.set(lockKey, refreshPromise);
  }
  return refreshPromise;
}

if (isNearExpiry && !hasRefreshToken) { /* warn and return undefined */ }

// Non-expiring: decrypt refresh token only if caller needs it
return {
  ...
  refreshToken: row.refresh_token ? decrypt(row.refresh_token, this.encKey) : undefined,
  ...
};
```

- **Effort**: Small
- **Risk**: Low

## Acceptance Criteria

- [ ] `decrypt(row.refresh_token)` is only called when the result is actually needed (i.e., inside the `isNearExpiry` branch or when constructing the final return value)
- [ ] All existing tests pass unchanged

## Work Log

- **2026-03-12**: Identified by performance-oracle (P2-C, downgraded to P3 here) in /ce:review.
