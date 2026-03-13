---
status: complete
priority: p3
issue_id: '009'
tags: [code-review, architecture, reliability]
dependencies: []
---

# 009 — Required `providerToken.encryptionSecret` not validated at startup

## Problem Statement

`providerToken.encryptionSecret` is only read inside `createProviderTokenServiceFactory`, which is called lazily the first time a plugin that depends on `providerTokenServiceRef` initializes. If the config key is absent:

- Backend starts successfully
- The error surface only when `atlassian-actions-backend` (or any future consumer) initializes
- The error message will reference `DefaultProviderTokenService.ts` and the lazy factory call stack, not `providerTokenPlugin`

Backstage best practice: validate required config in `registerInit` so config errors surface as startup failures attributed to the correct plugin.

## Findings

- **`plugins/provider-token-backend/src/DefaultProviderTokenService.ts` line 260**: `config.getString('providerToken.encryptionSecret')` — read in factory only
- **`plugins/provider-token-backend/src/plugin.ts`**: No config validation in `registerInit`
- Architecture-strategist flagged as P3

## Proposed Solutions

### Option A — Validate config in `plugin.ts registerInit`

```typescript
env.registerInit({
  deps: { database: coreServices.database, config: coreServices.rootConfig },
  async init({ database, config }) {
    // Validate required config early — fail at startup with clear attribution
    config.getString('providerToken.encryptionSecret');
    // ... migrations
  },
});
```

- **Effort**: Small
- **Risk**: Low

## Acceptance Criteria

- [ ] Missing `providerToken.encryptionSecret` causes startup failure attributed to `provider-token` plugin, not to a consuming plugin's lazy initialization
- [ ] The error message clearly identifies which config key is missing

## Work Log

- **2026-03-12**: Identified by architecture-strategist (P3) in /ce:review.
