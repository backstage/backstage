---
status: complete
priority: p2
issue_id: '004'
tags: [code-review, security, architecture, typescript]
dependencies: []
---

# 004 — `refreshToken` exposed on `ProviderToken` interface returned to action callers

## Problem Statement

The `ProviderToken` interface (in `provider-token-node/src/index.ts`) includes an optional `refreshToken?: string` field. This interface is the return type of `ProviderTokenService.getToken()` — the method called by every MCP action handler.

Refresh tokens are long-lived, high-privilege credentials. For Atlassian they are single-use rotating tokens; for all providers they allow indefinite impersonation of the user. Exposing them in the value returned to action handlers violates least-privilege: action handlers need only the `accessToken` to call provider APIs. No current action handler uses `refreshToken`, yet every future action handler has access to it.

If any action handler ever accidentally logs `token`, serializes it to output, or includes it in an error message, a refresh token is exfiltrated. The interface contract invites this.

## Findings

- **`plugins/provider-token-node/src/index.ts` line 55**: `refreshToken?: string` on `ProviderToken`
- **`plugins/provider-token-backend/src/DefaultProviderTokenService.ts` lines 154, 226**: `refreshToken` set in returned objects
- **`plugins/atlassian-actions-backend/src/plugin.ts` line 87**: Only `token.accessToken` is used — refresh token is unnecessary here
- Flagged by: security-sentinel (P2), code-simplicity-reviewer (P2), agent-native-reviewer (P2)

## Proposed Solutions

### Option A — Remove `refreshToken` from `ProviderToken` (Recommended)

```typescript
// provider-token-node/src/index.ts
export interface ProviderToken {
  userEntityRef: string;
  providerId: string;
  accessToken: string; // ← keep
  // refreshToken removed     // ← remove
  scope?: string;
  expiresAt?: Date;
}
```

Keep the refresh token only in an internal type used within `DefaultProviderTokenService` (e.g. `ProviderTokenRecord`).

- **Pros**: Strongest security boundary; action handlers cannot access refresh token by mistake
- **Cons**: Breaking API change if any external code already uses `ProviderToken.refreshToken`
- **Effort**: Small
- **Risk**: Low (packages are `private: true` and at version `0.1.0`)

### Option B — Split into two types: `ProviderToken` (public) and `ProviderTokenRecord` (internal)

```typescript
// provider-token-node: public return type for action handlers
export interface ProviderToken {
  userEntityRef;
  providerId;
  accessToken;
  scope;
  expiresAt;
}

// provider-token-backend: internal record for persistence layer
interface ProviderTokenRecord extends ProviderToken {
  refreshToken?: string;
}
```

- **Pros**: Clear separation of concerns; internal code can work with the full record
- **Cons**: Slightly more types to maintain
- **Effort**: Small
- **Risk**: Low

### Option C — Keep as-is, add `@internal` JSDoc and lint rule

- **Pros**: No code change
- **Cons**: Does not actually prevent access or misuse; documentation does not enforce security
- **Effort**: Minimal
- **Risk**: High (leaves the vulnerability in place)

## Recommended Action

_[To be filled during triage]_

## Technical Details

- **Affected files**: `plugins/provider-token-node/src/index.ts`, `plugins/provider-token-backend/src/DefaultProviderTokenService.ts`

## Acceptance Criteria

- [ ] `ProviderToken` returned by `getToken()` does NOT expose `refreshToken` to action handler callers
- [ ] Internal persistence/refresh logic still has access to refresh tokens (internal type or private fields)
- [ ] All existing tests pass with the updated interface

## Work Log

- **2026-03-12**: Identified by security-sentinel, code-simplicity-reviewer, agent-native-reviewer in /ce:review.
