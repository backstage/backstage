---
status: complete
priority: p1
issue_id: '001'
tags: [code-review, security, reliability, performance]
dependencies: []
---

# 001 — No fetch timeout on OAuth token refresh calls

## Problem Statement

All three token refresher classes (`AtlassianTokenRefresher`, `GithubTokenRefresher`, `MicrosoftTokenRefresher`) call `fetch()` with no `AbortSignal` timeout. If the OAuth endpoint hangs (network partition, provider incident), the fetch never rejects or resolves.

This has two compounding effects:

1. The `refreshLocks` Map in `DefaultProviderTokenService` stores the pending Promise. It is never settled, so the `.finally()` cleanup never fires, and the lock entry lives in `refreshLocks` permanently.
2. Every subsequent `getToken` call for that `userEntityRef|providerId` pair returns the same hanging Promise — effectively permanently denying that user their token until the backend process restarts.

During provider outages (which happen regularly for Atlassian, Microsoft, and GitHub), this turns a temporary issue into a permanent per-user denial of service for all users with expiring tokens.

## Findings

- **`plugins/provider-token-backend-module-atlassian/src/module.ts` line 48**: `fetch('https://auth.atlassian.com/oauth/token', { ... })` — no `signal`
- **`plugins/provider-token-backend-module-github/src/module.ts` line 49**: `fetch('https://github.com/login/oauth/access_token', { ... })` — no `signal`
- **`plugins/provider-token-backend-module-microsoft/src/module.ts` line 50**: `fetch(...)` — no `signal`
- **`plugins/provider-token-backend/src/DefaultProviderTokenService.ts` lines 121-130**: `refreshLocks` cleanup via `.finally()` never fires on a hanging promise
- **`plugins/atlassian-actions-backend/src/plugin.ts` line 85**: Jira API `fetch` call also has no timeout (secondary concern)

## Proposed Solutions

### Option A — `AbortSignal.timeout()` (Recommended)

```typescript
const response = await fetch('https://auth.atlassian.com/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: body.toString(),
  signal: AbortSignal.timeout(15_000),
});
```

- **Pros**: One line per fetch, native Node 18+ API, signal propagates to all underlying TCP operations
- **Cons**: Node 18 minimum required (check Backstage's supported Node version)
- **Effort**: Small
- **Risk**: Low

### Option B — `AbortController` + `setTimeout`

```typescript
const ac = new AbortController();
const timer = setTimeout(() => ac.abort(), 15_000);
try {
  const response = await fetch(url, { ..., signal: ac.signal });
  // ...
} finally {
  clearTimeout(timer);
}
```

- **Pros**: Works on Node 16+
- **Cons**: More boilerplate, requires try/finally discipline
- **Effort**: Small-Medium
- **Risk**: Low

### Option C — Wrapper utility

Extract a shared `fetchWithTimeout(url, init, ms = 15_000)` helper in `provider-token-node` or a shared util.

- **Pros**: DRY across all refreshers and action handlers
- **Cons**: Adds another abstraction layer
- **Effort**: Medium
- **Risk**: Low

## Recommended Action

_[To be filled during triage]_

## Technical Details

- **Affected files**: All 3 refresher `module.ts` files, `atlassian-actions-backend/src/plugin.ts`
- **Components**: `AtlassianTokenRefresher`, `GithubTokenRefresher`, `MicrosoftTokenRefresher`
- **Related**: `DefaultProviderTokenService.refreshLocks` cleanup path

## Acceptance Criteria

- [ ] All 3 refresher `refresh()` methods have a timeout on their `fetch` call (≤ 15s recommended)
- [ ] The Jira API `fetch` call in `atlassian-actions-backend` has a timeout
- [ ] If the fetch times out, the error propagates correctly through `refreshAndPersist` catch block (returns `undefined`, logs error)
- [ ] The `refreshLocks` entry is cleared via `.finally()` after a timeout (this is automatic once the fetch rejects)
- [ ] Unit test added: mock a hanging fetch (never resolves) and verify `getToken` returns `undefined` after timeout
- [ ] Backstage's minimum supported Node version supports `AbortSignal.timeout` OR Option B used

## Work Log

- **2026-03-12**: Identified by security-sentinel and performance-oracle agents during /ce:review. All 3 refreshers and the Jira action fetch are missing timeouts. Performance agents flagged this as P1 due to permanent lock accumulation.
