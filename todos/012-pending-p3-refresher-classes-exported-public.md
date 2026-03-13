---
status: complete
priority: p3
issue_id: '012'
tags: [code-review, architecture, typescript]
dependencies: []
---

# 012 — Refresher implementation classes exported `@public` — unnecessarily wide API surface

## Problem Statement

`AtlassianTokenRefresher`, `MicrosoftTokenRefresher`, and `GithubTokenRefresher` are exported from their respective module `index.ts` files as named exports. These are concrete HTTP-calling implementations that:

1. Directly hit provider OAuth endpoints
2. Have constructor signatures tied to specific config keys
3. May change if provider APIs change

Exporting them as `@public` implies a stable API surface. If adopters subclass them or directly instantiate them in tests, any change to constructor signatures or HTTP behaviour becomes a breaking change at version 0.1.0.

The `createBackendModule` default export (e.g., `providerTokenAtlassianModule`) is the stable public API. The class is an implementation detail. Unless there's a specific use case for adopters to instantiate the class directly (e.g., for custom wiring), the class exports should be `@internal`.

## Findings

- **`plugins/provider-token-backend-module-atlassian/src/index.ts` line 17**: Exports `AtlassianTokenRefresher`
- **`plugins/provider-token-backend-module-github/src/index.ts` line 17**: Exports `GithubTokenRefresher`
- **`plugins/provider-token-backend-module-microsoft/src/index.ts` line 17**: Exports `MicrosoftTokenRefresher`
- Architecture-strategist and code-simplicity-reviewer flagged as P3

## Proposed Solutions

### Option A — Remove class exports from index.ts, keep only module default (Recommended if no known use case for direct instantiation)

```typescript
// index.ts
export { providerTokenAtlassianModule as default } from './module';
// AtlassianTokenRefresher not re-exported
```

### Option B — Keep exports but mark `@internal`

```typescript
/** @internal */
export { AtlassianTokenRefresher } from './module';
```

### Option C — Keep as-is, document in API report

- **Pros**: No change needed
- **Cons**: Creates unnecessary stability obligation

## Recommended Action

_[To be filled during triage]_

## Technical Details

- **Affected files**: All 3 module `index.ts` files

## Acceptance Criteria

- [ ] A decision is made: are these classes part of the public API or not?
- [ ] If not public: class exports removed or marked `@internal` in JSDoc
- [ ] If public: API report generated and stability obligation documented

## Work Log

- **2026-03-12**: Identified by architecture-strategist (P3) and code-simplicity-reviewer (P3) in /ce:review.
