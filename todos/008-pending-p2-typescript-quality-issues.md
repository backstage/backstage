---
status: complete
priority: p2
issue_id: '008'
tags: [code-review, typescript, quality]
dependencies: []
---

# 008 — TypeScript quality issues: `let result` implicit `any`, duplicate session type, interface ordering

## Problem Statement

Several TypeScript quality issues across the codebase:

1. **`let result` without type annotation** (`DefaultProviderTokenService.ts:192`) — TypeScript infers `any` for `result` because it's declared before the `try` block.
2. **Anonymous session object type duplicated** — `upsertToken`'s session parameter type is defined inline in both the `ProviderTokenService` interface (`provider-token-node`) and the `DefaultProviderTokenService` implementation (`provider-token-backend`). This should be a named exported type `ProviderTokenSession` in the node package.
3. **`ProviderTokenRefresherExtensionPoint` interface declared after the constant that references it** (`provider-token-node/src/index.ts:115 vs 123`) — Confusing read order; types should precede usages.
4. **Test imports `providerTokenServiceRef` from wrong package** (`atlassian-actions-backend/src/plugin.test.ts:21`) — Test imports from `@devhub/plugin-provider-token-backend`; implementation imports from `@devhub/plugin-provider-token-node`. This is a layering violation.
5. **`response.json()` typed as `any` in all refreshers** — No typed interface for provider OAuth response bodies; silent `any` means null/undefined fields won't produce type errors.

## Findings

- **`DefaultProviderTokenService.ts:192`**: `let result;` — implicit `any`
- **`provider-token-node/src/index.ts:75-84`**: anonymous session object type on `upsertToken`
- **`DefaultProviderTokenService.ts:50-55`**: same shape repeated verbatim
- **`provider-token-node/src/index.ts:115`**: `providerTokenRefresherExtensionPoint` const uses `ProviderTokenRefresherExtensionPoint` type declared 8 lines later
- **`atlassian-actions-backend/src/plugin.test.ts:21`**: imports from `@devhub/plugin-provider-token-backend`
- **All 3 refresher `module.ts` files**: `const data = await response.json()` returns `any`

## Proposed Solutions

### Fix 1 — `let result` → typed const

```typescript
// Instead of:
let result;
try {
  result = await refresher.refresh(refreshToken);
} catch (err) { return undefined; }

// Use:
let result: RefreshResult;
try {
  result = await refresher.refresh(refreshToken);
} catch (err) {
  this.logger.error(...);
  return undefined;
}
```

### Fix 2 — Extract `ProviderTokenSession` type

```typescript
// In provider-token-node/src/index.ts:
export interface ProviderTokenSession {
  accessToken: string;
  refreshToken?: string;
  scope?: string;
  expiresInSeconds?: number;
}
// Then use: upsertToken(userEntityRef: string, providerId: string, session: ProviderTokenSession): Promise<void>;
```

### Fix 3 — Reorder declarations

Move `ProviderTokenRefresherExtensionPoint` interface above the `providerTokenRefresherExtensionPoint` const.

### Fix 4 — Fix test import

Change `plugin.test.ts:21` to import from `@devhub/plugin-provider-token-node`.

### Fix 5 — Type provider response bodies

```typescript
interface AtlassianTokenResponse {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  error?: string;
  error_description?: string;
}
const data = (await response.json()) as AtlassianTokenResponse;
if (!data.access_token)
  throw new Error('Atlassian token refresh returned no access_token');
```

## Recommended Action

_[To be filled during triage]_

## Technical Details

- **Affected files**: `DefaultProviderTokenService.ts`, `provider-token-node/src/index.ts`, `atlassian-actions-backend/src/plugin.test.ts`, all 3 refresher modules

## Acceptance Criteria

- [ ] `let result` in `refreshAndPersist` has an explicit `RefreshResult` type annotation
- [ ] Session parameter type is exported as `ProviderTokenSession` from `provider-token-node`
- [ ] `ProviderTokenRefresherExtensionPoint` interface declared before the const that uses it
- [ ] `atlassian-actions-backend/src/plugin.test.ts` imports `providerTokenServiceRef` from `@devhub/plugin-provider-token-node`
- [ ] Provider OAuth response bodies have typed interfaces in each refresher module

## Work Log

- **2026-03-12**: Identified by kieran-typescript-reviewer (P2) in /ce:review.
