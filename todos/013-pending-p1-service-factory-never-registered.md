---
status: completed
priority: p1
issue_id: '013'
tags: [code-review, architecture, correctness]
dependencies: []
---

# 013 — `providerTokenServiceRef` has no registered factory — suite is non-functional

## Problem Statement

`createProviderTokenServiceFactory` is exported from `plugins/provider-token-backend` but is
**never called** anywhere. Meanwhile, `providerTokenServiceRef` is created with no `defaultFactory`:

```typescript
// provider-token-node/src/index.ts
export const providerTokenServiceRef = createServiceRef<ProviderTokenService>({
  id: 'devhub.provider-token',
  scope: 'plugin',
  // ← no defaultFactory
});
```

Every plugin that injects `providerTokenServiceRef` (the atlassian-actions plugin, the auth
capture modules) will fail at startup with a "no factory registered for service" error.
The entire provider-token suite is currently non-functional in production.

## Root Cause

The architecture requires one of two patterns:

**Pattern A — defaultFactory on the ref (standard Backstage approach):**

```typescript
export const providerTokenServiceRef = createServiceRef<ProviderTokenService>({
  id: 'devhub.provider-token',
  scope: 'plugin',
  defaultFactory: async service =>
    import('@devhub/plugin-provider-token-backend').then(m =>
      m.createProviderTokenServiceFactory(service),
    ),
});
```

**Pattern B — explicit registration in backend/src/index.ts:**

```typescript
backend.add(createProviderTokenServiceFactory(providerTokenServiceRef));
```

Neither pattern is currently implemented.

## Findings

- **`plugins/provider-token-node/src/index.ts` line 163**: `providerTokenServiceRef` has no `defaultFactory`
- **`plugins/provider-token-backend/src/plugin.ts` line 87**: `createProviderTokenServiceFactory` is exported but never invoked
- **`packages/backend/src/index.ts`**: Does not call `createProviderTokenServiceFactory` or pass the factory to `backend.add`
- **`plugins/atlassian-actions-backend/src/plugin.ts` line 32**: Injects `providerTokenServiceRef` — will fail at startup with no registered factory
- **`plugins/auth-backend-module-atlassian-token-capture/src/module.ts` line 87**: Same injection failure

## Proposed Solution

Adopt Pattern A — add a `defaultFactory` to `providerTokenServiceRef` in `provider-token-node`.
This is the standard Backstage pattern for services that have a canonical implementation.
The `createProviderTokenServiceFactory` function becomes the implementation of the default factory
and can be simplified or inlined.

```typescript
// provider-token-node/src/index.ts
export const providerTokenServiceRef = createServiceRef<ProviderTokenService>({
  id: 'devhub.provider-token',
  scope: 'plugin',
  defaultFactory: async service =>
    import('@devhub/plugin-provider-token-backend').then(m =>
      m.createProviderTokenServiceFactory(service),
    ),
});
```

If circular dependency between `provider-token-node` and `provider-token-backend` is a concern
(it will not be — node is a dependency of backend, not the reverse), use Pattern B instead and
document the wiring requirement clearly in the README.

## Files to Change

- `plugins/provider-token-node/src/index.ts` — add `defaultFactory`
- `plugins/provider-token-backend/src/plugin.ts` — keep `createProviderTokenServiceFactory` or inline it
- `plugins/provider-token-backend/src/index.ts` — update exports
- Test the whole suite end-to-end by running the dev server and verifying a Jira action succeeds
