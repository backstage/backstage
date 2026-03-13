---
status: completed
priority: p2
issue_id: '016'
tags: [code-review, architecture, correctness]
dependencies: []
---

# 016 — Token capture before catalog lookup creates orphaned DB rows on catalog miss

## Problem Statement

In the auth capture modules, `tokenService.upsertToken()` is called **before** `signInWithCatalogUser()`:

```typescript
// auth-backend-module-atlassian-token-capture/src/module.ts
const userEntityRef = `user:${namespace}/${username}`;
await tokenService.upsertToken(userEntityRef, 'atlassian', info.result.session);  // ← persisted first

return ctx.signInWithCatalogUser(                                                   // ← may throw
  { entityRef: { namespace, name: username } },
  { dangerousEntityRefFallback: ... },
);
```

If `signInWithCatalogUser` throws (the user is not in the catalog and `dangerouslyAllowSignInWithoutUserInCatalog` is false), the token row has already been written to the DB. There is no rollback — the orphaned row sits in `provider_tokens` forever with no corresponding active session.

Over time, repeated sign-in attempts by uncatalogued users accumulate orphaned token rows that
waste storage and complicate audits. More importantly, a user who is legitimately removed from
the catalog can still have their OAuth tokens silently stored (and auto-refreshed if a refresh
token was captured), which is a data retention concern.

## Findings

- **`plugins/auth-backend-module-atlassian-token-capture/src/module.ts` lines 55-71**: `upsertToken` called before `signInWithCatalogUser`
- **`plugins/auth-backend-module-github-token-capture/src/module.ts`**: Same pattern
- **`plugins/auth-backend-module-microsoft-token-capture/src/module.ts`**: Same pattern (uses `findCatalogUser` first, then upserts — partial mitigation, but lookup can still fail between find and upsert)

## Proposed Solutions

### Option A — Wrap both operations in try/catch and clean up on failure

```typescript
await tokenService.upsertToken(userEntityRef, 'atlassian', info.result.session);
try {
  return await ctx.signInWithCatalogUser(...);
} catch (err) {
  // Catalog lookup failed — clean up orphaned token
  await tokenService.deleteToken(userEntityRef, 'atlassian').catch(() => {});
  throw err;
}
```

This is the simplest fix but has a small window where the token exists between upsert and
the catch block.

### Option B — Reverse the order: catalog lookup first, token write second

```typescript
// Attempt catalog resolution first — throws if user not found
const result = await ctx.signInWithCatalogUser(
  { entityRef: { namespace, name: username } },
  { dangerousEntityRefFallback: ... },
);
// Only persist token if catalog resolution succeeded
await tokenService.upsertToken(userEntityRef, 'atlassian', info.result.session);
return result;
```

This eliminates orphans entirely. The trade-off: if `upsertToken` fails after a successful
catalog lookup, the user is signed in but their token is not stored (they will get "no session"
errors on Jira actions). This is preferable to the current behaviour where the inverse can occur.

### Option C — Use a DB transaction across both operations

Not feasible — catalog lookup is a remote RPC, not a DB operation. Transactions cannot span
the two.

**Recommended: Option B.** It is simpler, eliminates the orphan case entirely, and the
failure mode (no token stored) is more visible and recoverable than the orphan case.

## Files to Change

- `plugins/auth-backend-module-atlassian-token-capture/src/module.ts`
- `plugins/auth-backend-module-github-token-capture/src/module.ts`
- `plugins/auth-backend-module-microsoft-token-capture/src/module.ts`
