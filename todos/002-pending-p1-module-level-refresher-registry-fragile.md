---
status: complete
priority: p1
issue_id: '002'
tags: [code-review, architecture, testing, reliability]
dependencies: []
---

# 002 — Module-level `refresherRegistry` breaks test isolation and initialization order

## Problem Statement

`refresherRegistry` in `plugins/provider-token-backend/src/plugin.ts` is a module-level `Map` exported as a named export. The `DefaultProviderTokenService` factory captures a reference to this singleton map at construction time.

**Two problems:**

1. **Test isolation**: Node.js caches modules. Any test file that imports from `@devhub/plugin-provider-token-backend` will share the same `Map` instance. A test that populates the registry will bleed state into subsequent test files in the same Jest worker. The existing unit tests avoid this by constructing `DefaultProviderTokenService` directly with their own `new Map()`, which is correct — but integration tests or future tests exercising the full plugin registration path are vulnerable.

2. **Initialization order across plugins**: Backstage guarantees that all modules for a given `pluginId` run before that plugin's own `registerInit`. It does NOT guarantee ordering between separate plugins. `atlassian-actions-backend` requests `providerTokenServiceRef` as a dependency, triggering `defaultFactory` lazily when that plugin initializes. At that moment, the `provider-token` refresher modules may not have fully populated the registry yet. Because the Map is passed by reference this happens to work in practice, but it is an implicit contract with no structural enforcement.

The correct Backstage pattern (used in `scaffolder-node`, `signals-node`) is to capture the extension point registrations in a local closure variable, and pass that closed-over array/map into the service factory — not via a module-level export.

## Findings

- **`plugins/provider-token-backend/src/plugin.ts` line 34**: `export const refresherRegistry = new Map<string, ProviderTokenRefresher>()`
- **`plugins/provider-token-backend/src/DefaultProviderTokenService.ts` line 30**: `import { refresherRegistry } from './plugin'`
- **`plugins/provider-token-backend/src/DefaultProviderTokenService.ts` line 268**: `return new DefaultProviderTokenService(db, encKey, refresherRegistry, ...)`
- Architecture agent confirmed this is a known Backstage antipattern vs. the closure-based approach used in official packages

## Proposed Solutions

### Option A — Closure-based registry (Recommended, aligns with Backstage patterns)

```typescript
// plugin.ts
export const providerTokenPlugin = createBackendPlugin({
  pluginId: 'provider-token',
  register(env) {
    // Local closure — not exported, not a global
    const refreshers = new Map<string, ProviderTokenRefresher>();

    env.registerExtensionPoint(providerTokenRefresherExtensionPoint, {
      addRefresher(refresher: ProviderTokenRefresher) {
        refreshers.set(refresher.providerId, refresher);
      },
    });

    env.registerExtensionPoint(providerTokenServiceExtensionPoint, {
      // Pass the closed-over map to the service factory
    });
    // ...
  },
});
```

The challenge is that `createProviderTokenServiceFactory` is called by `defaultFactory` in the node package, which can't receive the closed-over Map. One approach: use a second extension point or a factory registration pattern so the plugin wires the closed-over map into the service factory.

- **Pros**: Correct Backstage pattern, proper test isolation, no module-level state
- **Cons**: Requires rethinking how `defaultFactory` in node package accesses the registry; may need refactoring the `defaultFactory` approach
- **Effort**: Medium-Large
- **Risk**: Medium (touches the initialization wiring)

### Option B — Keep current pattern, add explicit test reset + documentation

Add `export function _resetRegistryForTests() { refresherRegistry.clear(); }` with `@testOnly` JSDoc and call it in `beforeEach`. Document the initialization order contract as a code comment.

- **Pros**: Minimal change, preserves current architecture
- **Cons**: Doesn't fix the fundamental architectural issue; test reset is a smell
- **Effort**: Small
- **Risk**: Low

### Option C — Move service factory creation into plugin's registerInit

Have `providerTokenPlugin.registerInit` also instantiate and register the service factory (using `coreServices.pluginFactory` or equivalent), so both the registry and the factory live in the same closure.

- **Pros**: Eliminates the need for the module-level global entirely
- **Cons**: Changes the overall initialization structure significantly
- **Effort**: Large
- **Risk**: High

## Recommended Action

_[To be filled during triage]_

## Technical Details

- **Affected files**: `plugins/provider-token-backend/src/plugin.ts`, `plugins/provider-token-backend/src/DefaultProviderTokenService.ts`
- **Components**: `refresherRegistry`, `createProviderTokenServiceFactory`, `DefaultProviderTokenService`

## Acceptance Criteria

- [ ] Tests for `DefaultProviderTokenService` do not share state across test suites when running in the same Jest worker
- [ ] The initialization contract between modules (populating the registry) and the service factory (reading it) is either enforced by structure or documented with an explicit comment
- [ ] Either: `refresherRegistry` is not a module-level export, OR: a `_resetRegistryForTests()` escape hatch is documented and used in test setup

## Work Log

- **2026-03-12**: Flagged by architecture-strategist (P1), kieran-typescript-reviewer (P1), and performance-oracle (P3) in /ce:review. The module-level singleton pattern is an antipattern vs Backstage's closure-based factory approach in scaffolder-node/signals-node.
