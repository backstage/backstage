---
status: pending
priority: p2
issue_id: '015'
tags: [code-review, architecture, security, privacy]
dependencies: []
---

# 015 — No sign-out hook: provider tokens accumulate indefinitely, never cleaned up

## Problem Statement

`ProviderTokenService.deleteTokens(userEntityRef)` exists to clean up all tokens for a user
on sign-out, but it is never called. None of the auth capture modules hook into Backstage's
sign-out lifecycle. This means:

1. Every user who signs in with Atlassian/GitHub/Microsoft gets a row persisted in `provider_tokens`.
2. If they sign out of Backstage, their OAuth tokens remain in the DB indefinitely.
3. If they leave the company and their Backstage account is deprovisioned but the DB row is not cleaned up, their (encrypted) OAuth tokens remain for the lifetime of the database.
4. The only cleanup path is `deleteToken` triggered by a 401 response from Jira — which only fires if someone calls a Jira action with a stale token.

For providers that do not rotate tokens and do not have expiry (rare), the stored access token
remains valid indefinitely even after the user signs out.

## Findings

- **`plugins/provider-token-node/src/index.ts` line 142**: `deleteTokens(userEntityRef): Promise<void>` documented as "Call from sign-out handlers" but no handler calls it
- **`plugins/auth-backend-module-atlassian-token-capture/src/module.ts`**: No sign-out hook registered
- **`plugins/auth-backend-module-github-token-capture/src/module.ts`**: No sign-out hook registered
- **`plugins/auth-backend-module-microsoft-token-capture/src/module.ts`**: No sign-out hook registered

## Proposed Solution

Backstage's auth system exposes a sign-out hook mechanism. Each auth capture module should
register a sign-out handler that calls `tokenService.deleteTokens(userEntityRef)`:

```typescript
// In auth capture module registerInit:
providers.registerProvider({
  providerId: 'atlassian',
  factory: createOAuthProviderFactory({
    authenticator: atlassianAuthenticator,
    signInResolverFactories: { ... },
    // Sign-out hook:
    async onSignOut({ userEntityRef }) {
      await tokenService.deleteTokens(userEntityRef);
    },
  }),
});
```

Verify the exact Backstage auth extension point API for sign-out callbacks — the API may differ
between `@backstage/plugin-auth-node` versions. If no sign-out hook is available, add a scheduled
cleanup job that deletes rows with `expires_at < NOW() - INTERVAL '7 days'` (expired tokens that
were never refreshed).

As an interim measure, add a background cleanup in `providerTokenPlugin.registerInit` that
runs on startup to delete tokens expired more than N days ago (configurable via
`providerToken.tokenRetentionDays`, default 30).

## Files to Change

- `plugins/auth-backend-module-atlassian-token-capture/src/module.ts`
- `plugins/auth-backend-module-github-token-capture/src/module.ts`
- `plugins/auth-backend-module-microsoft-token-capture/src/module.ts`
- `plugins/provider-token-backend/src/plugin.ts` (for cleanup job alternative)
