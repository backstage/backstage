---
status: complete
priority: p2
issue_id: '006'
tags: [code-review, reliability, performance]
dependencies: []
---

# 006 — `invalid_grant` not distinguished from transient errors — stale tokens never auto-cleaned

## Problem Statement

`DefaultProviderTokenService.refreshAndPersist` catches ALL errors from `refresher.refresh()` and returns `undefined`. There is no distinction between:

- **`invalid_grant`** — the refresh token was revoked, the user consented to a different scope, or the user de-authorized the app. The stale DB row should be deleted. Without deletion, every subsequent `getToken` call will find the same row, detect near-expiry, attempt the same failing refresh, get the same error, and log it — **forever, on every request**.
- **Transient network error / HTTP 503** — should return the still-valid (not-yet-expired) access token as a fallback, or at least not delete the row.
- **HTTP 429 rate limit** — should signal back-off, not treat as permanent failure.

The current uniform `return undefined` causes permanent log spam and continuous retry against an invalid token for `invalid_grant` scenarios.

## Findings

- **`plugins/provider-token-backend/src/DefaultProviderTokenService.ts` lines 193-203**: All errors caught and swallowed uniformly
- **Refresher `module.ts` files**: `invalid_grant` is thrown as a plain `Error` with the string in the message — there's no typed error hierarchy to distinguish it

## Proposed Solutions

### Option A — Tagged error class for permanent vs transient failures (Recommended)

```typescript
export class OAuthPermanentError extends Error { readonly isPermanent = true; }
// In refreshers:
if (data.error === 'invalid_grant') throw new OAuthPermanentError(`invalid_grant: ${sanitizedDesc}`);
throw new Error(`transient: ${response.status}`); // transient

// In refreshAndPersist:
} catch (err) {
  if (err instanceof OAuthPermanentError) {
    // Delete the stale token to prevent infinite retry loop
    await this.deleteToken(userEntityRef, providerId);
    this.logger.warn('Refresh token permanently revoked, deleted stale token', { userEntityRef, providerId });
  } else {
    this.logger.warn('Transient refresh failure', { userEntityRef, providerId, error: err.message });
  }
  return undefined;
}
```

- **Pros**: Stops the infinite retry loop; self-healing for revoked tokens
- **Effort**: Small-Medium
- **Risk**: Low

### Option B — Check error message string (simpler but fragile)

Check if `err.message.includes('invalid_grant')` or similar.

- **Pros**: Minimal code change
- **Cons**: Fragile string matching; breaks if error message format changes
- **Effort**: Small
- **Risk**: Medium

### Option C — Accept current behavior and document it

- **Pros**: No change
- **Cons**: Log spam; stale tokens remain in DB indefinitely; poor user experience
- **Effort**: None
- **Risk**: High (operational burden)

## Recommended Action

_[To be filled during triage]_

## Technical Details

- **Affected files**: `plugins/provider-token-backend/src/DefaultProviderTokenService.ts`, all 3 refresher modules

## Acceptance Criteria

- [ ] When a refresh fails with `invalid_grant` (or equivalent permanent error), the stale token row is deleted from the DB
- [ ] When a refresh fails with a transient error (network, 5xx), the token row is NOT deleted
- [ ] The infinite retry loop for permanently revoked tokens is eliminated
- [ ] Tests cover both scenarios

## Work Log

- **2026-03-12**: Identified by performance-oracle (P2-B) and security-sentinel in /ce:review.
