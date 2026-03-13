---
status: complete
priority: p1
issue_id: '003'
tags: [code-review, architecture, performance, database]
dependencies: []
---

# 003 — DB migrations run twice on every backend startup

## Problem Statement

`db.migrate.latest()` is called in two separate places targeting the same migration directory:

1. **`providerTokenPlugin.registerInit`** in `plugin.ts` (lines 56–62)
2. **`createProviderTokenServiceFactory`** in `DefaultProviderTokenService.ts` (lines 253–258)

Both calls run on every cold start. Knex's migration runner is idempotent — it won't apply the same migration twice — but this creates several problems:

- **PostgreSQL advisory lock contention**: Two concurrent `migrate.latest` calls on the same database acquire/release the same advisory lock, serializing and doubling startup latency for the migration phase.
- **Ownership ambiguity**: If the plugin's `registerInit` is ever accidentally removed from `backend/src/index.ts`, the service factory silently takes over migration responsibility with no warning. Conversely, a developer who removes one of the two calls thinking it's redundant may remove the wrong one.
- **Different DB clients**: Each `database.getClient()` call may return a separate Knex instance, both managing migrations on the same tables.

The canonical Backstage pattern is clear: schema management belongs to the plugin's `registerInit`, not to the service factory. The service factory should assume the schema already exists when it runs.

## Findings

- **`plugins/provider-token-backend/src/plugin.ts` lines 56-62**: First `db.migrate.latest()` call
- **`plugins/provider-token-backend/src/DefaultProviderTokenService.ts` lines 253-258**: Second (redundant) `db.migrate.latest()` call
- Flagged independently by: architecture-strategist (P1), performance-oracle (P2-A), code-simplicity-reviewer (P1), security-sentinel (P2)

## Proposed Solutions

### Option A — Remove migration from service factory (Recommended)

Delete lines 253–258 from `createProviderTokenServiceFactory`. The plugin's `registerInit` is the correct and sole owner.

```typescript
export function createProviderTokenServiceFactory(
  service: ServiceRef<ProviderTokenService, 'plugin'>,
) {
  return createServiceFactory({
    service,
    deps: {
      database: coreServices.database,
      config: coreServices.rootConfig,
      logger: coreServices.logger,
    },
    async factory({ database, config, logger }) {
      const db = await database.getClient();
      // ← migration removed; plugin.ts registerInit owns this
      const secret = config.getString('providerToken.encryptionSecret');
      // ...
    },
  });
}
```

- **Pros**: Single source of truth, aligns with Backstage convention, simpler
- **Cons**: The service factory implicitly depends on the plugin being registered. If the plugin is omitted from `backend/src/index.ts`, the service will fail at runtime when tables don't exist.
- **Effort**: Small (delete ~6 lines)
- **Risk**: Low (Knex will throw a clear "table does not exist" error if migration hasn't run)

### Option B — Remove migration from plugin.ts, keep it in service factory

- **Pros**: Service factory is self-contained — works even if the plugin's registerInit is skipped
- **Cons**: Non-standard pattern; plugins should own their schema
- **Effort**: Small
- **Risk**: Low functionally, but deviates from Backstage conventions

### Option C — Keep both, add `assertMigrationsRan` check in service factory

Replace the redundant `migrate.latest` in the factory with a check that the `provider_tokens` table exists, throwing a clear error if the plugin's `registerInit` hasn't run yet.

- **Pros**: Fail-fast behaviour; clearer error message
- **Cons**: Still two code paths, adds complexity
- **Effort**: Small-Medium
- **Risk**: Low

## Recommended Action

_[To be filled during triage]_

## Technical Details

- **Affected files**: `plugins/provider-token-backend/src/DefaultProviderTokenService.ts` lines 253-258
- **Components**: `createProviderTokenServiceFactory`, `providerTokenPlugin.registerInit`

## Acceptance Criteria

- [ ] `db.migrate.latest()` is called exactly once during backend startup for the `provider-token` plugin
- [ ] If the plugin's `registerInit` is NOT registered in `backend/src/index.ts`, the system fails fast with a clear error rather than silently running migrations from the service factory
- [ ] No change to existing migration files

## Work Log

- **2026-03-12**: Flagged by architecture-strategist, performance-oracle, code-simplicity-reviewer, and security-sentinel agents in /ce:review. Unanimous: redundant call should be removed from `DefaultProviderTokenService.ts`.
