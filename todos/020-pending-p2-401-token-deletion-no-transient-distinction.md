---
status: completed
priority: p2
issue_id: '020'
tags: [code-review, reliability, correctness]
dependencies: []
---

# 020 — Unconditional token deletion on any Jira 401 confuses transient and permanent auth failures

## Problem Statement

`handleUnauthorized()` in the Jira actions plugin unconditionally deletes the stored Atlassian
token whenever Jira returns HTTP 401:

```typescript
async function handleUnauthorized(userEntityRef: string): Promise<never> {
  await tokenService.deleteToken(userEntityRef, 'atlassian');
  // ...
  throw new Error(
    'Atlassian session was rejected. Please re-authenticate via Backstage.',
  );
}
```

Jira can return 401 for reasons that are NOT permanent token revocation:

- Atlassian auth service transient error (5xx that appears as 401 due to gateway behaviour)
- OAuth app's scope does not cover the requested endpoint (configuration issue, not token issue)
- Token was temporarily invalidated during an Atlassian maintenance window and would be valid again in seconds

Deleting the token on any of these transient 401s forces the user through a full re-authentication
flow unnecessarily. In a team environment, a single misconfigured OAuth scope would cause every
user's token to be deleted on first action use — a mass disruption.

## Findings

- **`plugins/atlassian-actions-backend/src/plugin.ts` lines 68-76**: `handleUnauthorized` always calls `deleteToken`
- **`plugins/atlassian-actions-backend/src/plugin.ts` lines 144-145, 270-271, 353-354**: All three actions call `handleUnauthorized` on 401

## Proposed Solution

Align the 401 handling with the existing `OAuthPermanentError` pattern: only delete the token when
the token itself is confirmed permanently invalid. The primary mechanism for this is already in
place — `DefaultProviderTokenService.refreshAndPersist` catches `OAuthPermanentError` and deletes
the token.

For action-level 401s:

1. **Option A (recommended):** Return the error without deleting the token. Let the next token
   refresh cycle (triggered by near-expiry) perform the deletion if the refresh token is
   also invalid. The Jira 401 is treated as a signal to present an error to the user but
   not to destroy their session.

2. **Option B:** Before deleting, attempt a token refresh. If the refresh succeeds, retry the
   Jira request once with the new token. If the retry also 401s, then delete.

3. **Option C:** Attempt to distinguish Atlassian's auth error body. Atlassian returns
   `{"code":401,"message":"..."}` on genuine auth failures. If the body indicates a token
   issue specifically, delete; otherwise surface the error without deleting.

**Recommended:** Option A is simplest and most conservative. The error message can say
`'Atlassian returned 401 — your session may be invalid. If this persists, re-authenticate via Backstage.'`
rather than asserting the session is definitely revoked.

## Files to Change

- `plugins/atlassian-actions-backend/src/plugin.ts` — change `handleUnauthorized` to not delete on first 401
