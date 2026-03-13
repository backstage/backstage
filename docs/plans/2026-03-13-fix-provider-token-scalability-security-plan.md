---
title: 'fix: Provider Token Plugin — Scalability, Security, and Correctness Hardening'
type: fix
status: completed
date: 2026-03-13
---

# fix: Provider Token Plugin — Scalability, Security, and Correctness Hardening

## Overview

The provider-token plugin suite captures OAuth tokens at sign-in (Atlassian, GitHub, Microsoft), stores them encrypted in a database, proactively refreshes them, and serves them to MCP actions that call external APIs on behalf of users. The architecture correctly preserves per-user RBAC — each API call is authenticated with the user's own token, not a shared service account.

A thorough architectural review identified ten gaps across three priority tiers. This plan addresses them in priority order. The core data model and 5-layer architecture are sound and do not require structural change; all fixes are targeted and incremental.

## Problem Statement / Motivation

### Architecture Summary (as-built)

```
provider-token-node          → TypeScript contracts (ServiceRef, ExtensionPoint, types)
provider-token-backend       → DefaultProviderTokenService (crypto, DB, refresh scheduler, thundering-herd dedup)
provider-token-backend-module-atlassian/github/microsoft  → ProviderTokenRefresher impls
auth-backend-module-atlassian/github/microsoft-token-capture → sign-in intercept, token capture
atlassian-actions-backend    → MCP action consumer (Jira getIssue, searchIssues, addComment)
```

### Gaps Identified

| ID  | Priority | Category      | Gap                                                                                                                                                                                                                                |
| --- | -------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G1  | 🔴 P1    | Correctness   | `providerTokenServiceRef` scope `'plugin'` — each consumer creates its own `DefaultProviderTokenService` instance with an isolated `refreshLocks` Map, defeating thundering-herd deduplication                                     |
| G2  | 🔴 P1    | Scalability   | In-process `refreshLocks` Map cannot coordinate across replicas — two pods can simultaneously consume a single-use Atlassian refresh token → `OAuthPermanentError` + row deletion = unexpected user logout                         |
| G3  | 🟠 P2    | Correctness   | No sign-out cleanup — `deleteTokens()` exists but is never called; tokens accumulate indefinitely, and revoked sessions leave orphaned rows                                                                                        |
| G4  | 🟠 P2    | Security      | Static HKDF salt hardcoded as `'backstage-provider-token-salt-v1'` — all deployments using the same `app.config.yaml` secret derive an identical encryption subkey; cross-deployment isolation relies entirely on the secret value |
| G5  | 🟠 P2    | Security      | No key rotation path — rotating the encryption secret breaks all existing stored tokens (encrypted with the old subkey) with no re-encryption mechanism                                                                            |
| G6  | 🟡 P3    | Performance   | No in-process token cache — every `getToken()` call hits the database even when the token is valid for hours                                                                                                                       |
| G7  | 🟡 P3    | Observability | Missing `created_at` column and `expires_at` index — no audit trail, and bulk-expiry queries require a full table scan                                                                                                             |
| G8  | 🟡 P3    | Correctness   | Microsoft sign-in resolver performs two catalog lookups (legacy `findCatalogUser` + `signInWithCatalogUser`); the first is redundant                                                                                               |
| G9  | ⚪ Later | Extensibility | `atlassian.cloudId` is a single string — cannot support users spanning multiple Atlassian Cloud instances                                                                                                                          |
| G10 | ⚪ Later | Resilience    | No retry on transient refresh errors — a 503 from Atlassian causes the token row to remain stale until the next scheduled refresh cycle                                                                                            |

---

## Proposed Solution

### Phase 1 — Critical Correctness (P1, must ship before production load)

#### G1 · Promote `providerTokenServiceRef` to root scope

**File:** `plugins/provider-token-node/src/index.ts`

Change `scope: 'plugin'` to `scope: 'root'` on `providerTokenServiceRef`. This ensures a single `DefaultProviderTokenService` instance is created for the entire backend process, so `refreshLocks` (the in-process thundering-herd Map) is shared across all plugin consumers.

```typescript
// plugins/provider-token-node/src/index.ts
export const providerTokenServiceRef = createServiceRef<ProviderTokenService>({
  id: 'devhub.provider-token',
  scope: 'root',           // was: 'plugin'
  defaultFactory: async () => { ... },
});
```

**Risk:** Root-scoped services cannot inject plugin-scoped services. Verify that `DefaultProviderTokenService` only depends on root-scoped core services (`database`, `logger`, `rootConfig`, `scheduler`) — it does; no plugin-scoped deps.

**Files to change:**

- `plugins/provider-token-node/src/index.ts` — scope change
- `plugins/provider-token-backend/src/plugin.ts` — confirm `createProviderTokenServiceFactory` uses root-scoped deps only (already true)

---

#### G2 · DB-level advisory lock for multi-replica refresh coordination

**Problem:** In a k8s deployment with ≥2 replicas, both pods can wake up for the same user's expired token, both read the same `refresh_token` from DB, and both call the upstream token endpoint. For Atlassian (single-use refresh tokens), the second call returns `invalid_grant` → `OAuthPermanentError` → row deleted → user is logged out.

**Solution:** Wrap each refresh in a database advisory lock keyed on `(user_entity_ref, provider_id)`. The lock must be database-level (not in-process) so it spans replicas. Use `pg_try_advisory_xact_lock(hashtext(key))` for PostgreSQL; for SQLite (dev), fall back gracefully (no-op).

**Implementation approach:**

1. In `DefaultProviderTokenService.refreshTokenIfNeeded()`, before reading the current token, acquire an advisory lock:
   ```sql
   -- PostgreSQL
   SELECT pg_try_advisory_xact_lock(hashtext($1))
   -- where $1 = 'user:default/alice|atlassian'
   ```
2. If the lock is not acquired (another replica holds it), read the token again — it will have been refreshed by the winner — and return the fresh value.
3. Wrap the lock + refresh + write in a single DB transaction so the lock is released atomically on commit/rollback.
4. For SQLite, detect dialect and skip the advisory lock call (SQLite is single-process, in-process Map is sufficient).

**Files to change:**

- `plugins/provider-token-backend/src/DefaultProviderTokenService.ts` — add `acquireAdvisoryLock(knex, key)` helper and wrap `refreshTokenIfNeeded`
- `plugins/provider-token-backend/src/plugin.ts` — no change needed (Knex instance already available)
- `plugins/provider-token-backend/migrations/` — no schema change needed (advisory locks are transient)

**Mermaid — lock flow across replicas:**

```mermaid
sequenceDiagram
    participant R1 as Replica 1
    participant R2 as Replica 2
    participant DB as PostgreSQL

    R1->>DB: BEGIN; SELECT pg_try_advisory_xact_lock('alice|atlassian')
    DB-->>R1: true (lock acquired)
    R2->>DB: BEGIN; SELECT pg_try_advisory_xact_lock('alice|atlassian')
    DB-->>R2: false (lock held by R1)
    R2->>DB: SELECT access_token FROM provider_tokens WHERE ... (re-read)
    DB-->>R2: fresh token (written by R1 below)
    R1->>DB: UPDATE provider_tokens SET access_token=... COMMIT
    DB-->>R1: ok
    R2-->>R2: return fresh token without calling upstream
```

---

### Phase 2 — Near-Term Security & Correctness (P2, ship within next sprint)

#### G3 · Sign-out hook → `deleteTokens()`

**Problem:** No caller invokes `deleteTokens()`. When a user signs out of Backstage, their provider tokens remain in the database indefinitely. Revoked Backstage sessions still have live provider tokens that could be retrieved if the service were compromised.

**Solution:** Register an `authPlugin` sign-out event handler that calls `tokenService.deleteTokens(userEntityRef)`.

The Backstage auth plugin exposes a sign-out extension point (or alternatively a lifecycle hook). Register the cleanup in:

- `auth-backend-module-atlassian-token-capture/src/module.ts` — on sign-out for the `atlassian` provider
- Or: create a new `provider-token-backend-module-signout-cleanup` module that listens to the auth sign-out extension point for all providers

**Files to change:**

- `plugins/auth-backend-module-atlassian-token-capture/src/module.ts`
- `plugins/auth-backend-module-github-token-capture/src/module.ts`
- `plugins/auth-backend-module-microsoft-token-capture/src/module.ts`
- Or: new module `plugins/provider-token-backend-module-signout-cleanup/`

**Acceptance criteria:**

- [ ] Sign out from Backstage UI → row deleted from `provider_tokens` within 5 seconds
- [ ] Subsequent `getToken()` calls return `null`
- [ ] Test: mock sign-out event, assert `deleteTokens` called with correct `userEntityRef`

---

#### G4 · Configurable HKDF salt (per-deployment isolation)

**Problem:** `HKDF_SALT = 'backstage-provider-token-salt-v1'` is a compile-time constant. Two different organisations running the same codebase with the same configured secret would derive the same encryption subkey, providing no cross-deployment isolation.

**Solution:** Read the salt from config with the hardcoded value as fallback:

```typescript
// plugins/provider-token-backend/src/crypto.ts
const salt =
  config.getOptionalString('providerToken.hkdfSalt') ??
  'backstage-provider-token-salt-v1';
```

Document in `app-config.yaml` reference:

```yaml
providerToken:
  hkdfSalt: 'your-unique-deployment-salt-here' # optional, defaults to package default
```

**Files to change:**

- `plugins/provider-token-backend/src/crypto.ts` — accept `salt` parameter
- `plugins/provider-token-backend/src/DefaultProviderTokenService.ts` — pass salt from config
- `plugins/provider-token-backend/src/plugin.ts` — read config, pass to service

---

#### G5 · Dual-key rotation path

**Problem:** Rotating the encryption secret (e.g., after a credential leak) requires re-encrypting all stored tokens. No mechanism exists; rotating the secret immediately breaks all tokens.

**Solution:** Implement a "dual-key" read-then-write rotation:

1. Add optional `providerToken.previousSecret` config key.
2. On `getToken()`: if decryption with the current key fails AND `previousSecret` is set, attempt decryption with the previous key's derived subkey.
3. On successful decryption with the previous key, immediately re-encrypt with the current key and write back to DB (lazy rotation).
4. After all rows have been migrated (observable via metrics), remove `previousSecret` from config.

**Ciphertext format:** The existing `v1:<iv>:<tag>:<data>` prefix is already structured for versioning. When a token was re-encrypted it will still emit `v1:...`; if a new key scheme is needed in future, `v2:...` can be added.

**Files to change:**

- `plugins/provider-token-backend/src/crypto.ts` — add `decryptWithFallback(ciphertext, key, fallbackKey?)`
- `plugins/provider-token-backend/src/DefaultProviderTokenService.ts` — call fallback decrypt and re-encrypt on read
- `plugins/provider-token-backend/src/plugin.ts` — read `previousSecret` from config

**Config example:**

```yaml
providerToken:
  secret: 'new-secret-here'
  previousSecret: 'old-secret-here' # remove after migration completes
```

---

### Phase 3 — Medium-Term Polish (P3, next 2 sprints)

#### G6 · In-process LRU token cache

**Problem:** Every `getToken()` call issues a DB query even when the token is valid for another 50 minutes. At MCP scale (many concurrent tool calls), this adds avoidable latency and DB load.

**Solution:** Add a short-lived in-process LRU cache in `DefaultProviderTokenService`:

```typescript
// Cache entries for tokens valid for > CACHE_MIN_TTL seconds
// TTL = min(token.expiresAt - now - CACHE_BUFFER_SECS, CACHE_MAX_TTL_SECS)
private readonly cache = new LRUCache<string, TokenEntry>({
  max: 1000,           // max 1000 unique user+provider combinations
  ttl: 5 * 60 * 1000, // 5 minutes max, but see below
});
```

Cache key: `${userEntityRef}|${providerId}`. TTL is capped at 5 minutes OR `expiresAt - now - 60s`, whichever is shorter.

**Invalidation:** On `upsertToken()` and `deleteToken()`, evict the corresponding cache entry immediately.

**Files to change:**

- `plugins/provider-token-backend/src/DefaultProviderTokenService.ts` — add LRU cache
- `plugins/provider-token-backend/package.json` — add `lru-cache` dependency (already in Backstage root, likely available)

---

#### G7 · `created_at` column + `expires_at` index migration

**Problem:** The `provider_tokens` table has no `created_at` column (no audit trail) and no index on `expires_at` (scheduled refresh queries scan the full table).

**Solution:** New migration file adding both:

```javascript
// plugins/provider-token-backend/migrations/20260313000000_add_created_at_and_expires_index.js
exports.up = async knex => {
  await knex.schema.table('provider_tokens', table => {
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
  });
  await knex.schema.raw(
    `CREATE INDEX IF NOT EXISTS idx_provider_tokens_expires_at ON provider_tokens (expires_at)`,
  );
};

exports.down = async knex => {
  await knex.schema.raw(`DROP INDEX IF EXISTS idx_provider_tokens_expires_at`);
  await knex.schema.table('provider_tokens', table => {
    table.dropColumn('created_at');
  });
};
```

**Files to change:**

- `plugins/provider-token-backend/migrations/20260313000000_add_created_at_and_expires_index.js` — new file

---

#### G8 · Microsoft resolver — remove double catalog lookup

**Problem:** `auth-backend-module-microsoft-token-capture/src/module.ts` calls `ctx.findCatalogUser()` (legacy API, performs a catalog lookup) and then `ctx.signInWithCatalogUser()` (performs a second catalog lookup). The first is redundant.

**Solution:** Remove the `findCatalogUser` call. Use `signInWithCatalogUser` exclusively, as the Atlassian and GitHub resolvers already do.

**Files to change:**

- `plugins/auth-backend-module-microsoft-token-capture/src/module.ts` — remove `findCatalogUser` call

---

### Phase 4 — Future Considerations (Later)

#### G9 · Multi-cloudId support

**Current limitation:** `atlassian.cloudId` is a single string. Organisations with multiple Atlassian Cloud instances (e.g., separate instances for engineering and sales) cannot route API calls to the correct instance.

**Proposed approach:**

1. Change config to `atlassian.cloudIds: Record<string, string>` mapping a logical name to a cloudId.
2. Add `cloud` parameter to `atlassian:jira:*` actions (optional, defaults to `'default'`).
3. Resolve `cloudId` from the map at action runtime.

This is backwards-compatible: if `atlassian.cloudId` (singular) is still set, treat it as `cloudIds.default`.

---

#### G10 · Retry on transient refresh errors

**Current behaviour:** Any non-`OAuthPermanentError` from a refresher leaves the token row stale. The next scheduled refresh cycle will retry, but there is no active retry.

**Proposed approach:** In `DefaultProviderTokenService`, wrap the refresh call in an exponential-backoff retry (max 3 attempts, 1s/2s/4s jitter) for errors that are not `OAuthPermanentError`. Use `p-retry` (already a common Backstage dep) or a simple loop.

---

## Technical Considerations

### Scope change (G1) interaction with plugin lifecycle

Root-scoped services are initialised before plugin-scoped services. Changing `providerTokenServiceRef` to `'root'` means `DefaultProviderTokenService` cannot receive plugin-scoped dependencies. Audit current deps:

| Dep                                    | Scope                     | OK? |
| -------------------------------------- | ------------------------- | --- |
| `coreServices.database`                | root                      | ✅  |
| `coreServices.logger`                  | root                      | ✅  |
| `coreServices.rootConfig`              | root                      | ✅  |
| `coreServices.scheduler`               | root                      | ✅  |
| `providerTokenRefresherExtensionPoint` | — (populated before init) | ✅  |

No plugin-scoped deps exist. Safe to promote.

### Advisory lock (G2) — SQLite fallback

SQLite does not support advisory locks. Dev environments typically use SQLite. Use Knex dialect detection:

```typescript
function isPostgres(knex: Knex): boolean {
  return (
    knex.client.config.client === 'pg' ||
    knex.client.config.client === 'postgresql'
  );
}
```

Skip the advisory lock on non-Postgres. Document that multi-replica deployments require PostgreSQL.

### Key rotation (G5) — atomicity

The lazy re-encryption (decrypt with old key → re-encrypt with new key → write) must happen within the same DB transaction as the token read to avoid a TOCTOU window. The re-encryption write should be a separate `UPDATE` inside the transaction.

### LRU cache (G6) — correctness

The cache must be invalidated on `upsertToken` (new token written by the refresh scheduler or by a sign-in) and on `deleteToken` (sign-out or permanent error cleanup). Failure to invalidate could serve a revoked token for up to 5 minutes — acceptable for an internal developer portal but must be documented.

---

## System-Wide Impact

### Interaction Graph

- **G1 (scope change):** `providerTokenServiceRef` → `DefaultProviderTokenService` singleton. All callers (`atlassian-actions-backend`, future action plugins) share one instance. `refreshLocks` Map is now globally effective.
- **G2 (advisory lock):** Lock acquired inside DB transaction. Affects `DefaultProviderTokenService.refreshTokenIfNeeded()` only. No impact on `getToken()` hot path.
- **G3 (sign-out):** Auth plugin emits sign-out event → `deleteTokens()` → DB `DELETE` → LRU cache eviction (G6 must handle this).
- **G5 (key rotation):** `getToken()` may now issue an extra DB `UPDATE` during the rotation window. Adds latency only while `previousSecret` is configured.
- **G6 (LRU cache):** `getToken()` returns cached value → skips DB. `upsertToken()` and `deleteToken()` must evict. Order matters: evict BEFORE returning from write methods.

### Error & Failure Propagation

- Advisory lock timeout (G2): Should have a 5-second lock timeout. If exceeded, fall back to reading the current DB row (optimistic read). Do NOT throw — a stale read is better than a 500.
- Fallback decrypt failure (G5): If neither current nor previous key can decrypt, throw a non-`OAuthPermanentError` so the token row is NOT deleted. Log at `warn` level with the `userEntityRef` (not the token value).
- Cache eviction failure: LRU cache operations are synchronous and infallible — no error path.

### State Lifecycle Risks

- **G2 without G1:** If the service is still plugin-scoped (G1 not applied), the advisory lock prevents cross-replica double-refresh but the in-process `refreshLocks` dedup is still per-instance. Apply G1 first.
- **G5 partial rotation:** If a pod crashes mid-re-encryption, the row retains the old ciphertext. Next read will re-encrypt again. Safe (idempotent).
- **G3 timing:** If sign-out fires while a refresh is in progress (lock held), the `deleteTokens()` call will either: (a) complete normally and delete the row after the refresh commits, or (b) if wrapped in the same transaction as the lock, will see the lock and wait. Ensure `deleteTokens()` is NOT wrapped in the advisory lock transaction.

---

## Acceptance Criteria

### Phase 1 (P1 — Critical) ✅ IMPLEMENTED

> **Implementation note:** The plan specified `scope: 'root'` and PostgreSQL advisory locks.
> During implementation, both were found infeasible/undesirable and replaced with simpler,
> equally correct alternatives (see commit `fix(provider-token-backend): share refresh locks…`):
>
> - **G1 (scope change):** `coreServices.database` and `coreServices.logger` are plugin-scoped and
>   cannot be injected into a root-scoped service. Instead: exported `sharedRefreshLocks` as a
>   module-level Map; production factory passes it to every instance; tests omit it for isolation.
>
> - **G2 (advisory locks):** Transaction-scoped advisory locks hold a DB connection for the full
>   15 s HTTP call (connection pool exhaustion risk). Instead: optimistic `updated_at` lock —
>   `UPDATE WHERE updated_at = $last` atomically claims the slot without holding a connection.

- [x] `providerTokenServiceRef` scope stays `'plugin'`; `sharedRefreshLocks` module-level map shared across all instances instead (equivalent correctness, avoids root-scope dep issues)
- [x] Single shared `refreshLocks` Map verified via G1 integration test (two instances → refresher called once)
- [x] Regression test confirms isolated Maps produce multiple refreshes (proves the fix is meaningful)
- [x] G2 optimistic `updated_at` claim implemented for PostgreSQL; SQLite path verified via G2 test
- [x] SQLite graceful fallback: `isPostgres()` returns false → claim skipped, refresh proceeds normally

### Phase 2 (P2 — Near-term)

- [x] Sign-out in Backstage UI → row absent from `provider_tokens` table
- [x] `providerToken.hkdfSalt` config key accepted; default behaviour unchanged when omitted
- [x] `providerToken.previousSecret` enables decryption of tokens encrypted with old key
- [x] After lazy re-encryption, token is decryptable with current key only (previous key no longer works for that row)
- [x] Removing `previousSecret` from config does not break any rows that have already been re-encrypted

### Phase 3 (P3 — Medium-term)

- [x] Repeated `getToken()` calls within 5 minutes issue at most one DB query per user+provider
- [x] Cache is evicted immediately on `upsertToken()` and `deleteToken()`
- [x] `provider_tokens` table has `created_at` column populated for all new rows
- [x] `EXPLAIN ANALYZE` on `SELECT ... WHERE expires_at < now()` uses the new index
- [x] Microsoft sign-in resolver calls `signInWithCatalogUser` exactly once (no double lookup)

---

## Success Metrics

- **Zero unexpected logouts** caused by multi-replica refresh races (G2)
- **DB query rate from `getToken()`** reduced by ≥70% after LRU cache (G6)
- **Table scan eliminated** on scheduled refresh query after `expires_at` index (G7)
- **Secret rotation drill:** rotate `providerToken.secret` with `previousSecret` set → all users retain active sessions → remove `previousSecret` → sessions remain active (G5)

---

## Dependencies & Prerequisites

| Item                                    | Required For        | Notes                                                           |
| --------------------------------------- | ------------------- | --------------------------------------------------------------- |
| PostgreSQL in production                | G2 (advisory locks) | SQLite fallback available for dev                               |
| Backstage auth sign-out extension point | G3                  | Verify `@backstage/plugin-auth-node` exposes sign-out lifecycle |
| `lru-cache` package                     | G6                  | Available in Backstage node_modules; add to package.json        |
| Knex dialect detection                  | G2                  | Already available via `knex.client.config.client`               |

---

## Risk Analysis & Mitigation

| Risk                                            | Likelihood | Impact | Mitigation                                                                                                             |
| ----------------------------------------------- | ---------- | ------ | ---------------------------------------------------------------------------------------------------------------------- |
| Root scope breaks other consumers               | Low        | High   | Audit all consumers of `providerTokenServiceRef`; all are action plugins with no plugin-scoped deps                    |
| Advisory lock deadlock                          | Very Low   | Medium | Use `pg_try_advisory_xact_lock` (non-blocking) with fallback read, not `pg_advisory_xact_lock` (blocking)              |
| LRU cache serves revoked token                  | Low        | Low    | 5-minute max TTL; document limitation; sign-out evicts immediately                                                     |
| Key rotation migration window breaks tokens     | Low        | High   | Dual-key path handles this; only tokens encrypted between secret rotation and next read are at risk (near-zero window) |
| `findCatalogUser` removal breaks Microsoft flow | Low        | Medium | `signInWithCatalogUser` is the correct API; write integration test covering the Microsoft path before removing         |

---

## Documentation Plan

- [ ] Update `plugins/provider-token-backend/README.md` — document `providerToken.hkdfSalt`, `providerToken.previousSecret`, and key rotation procedure
- [ ] Update `plugins/provider-token-node/README.md` — note that `providerTokenServiceRef` is root-scoped and must only depend on root-scoped services
- [ ] Add `app-config.yaml` reference section for all new config keys
- [ ] Add ADR (Architecture Decision Record) in `docs/architecture-decisions/` for the decision to use PostgreSQL advisory locks over a Redis-based distributed lock

---

## Sources & References

### Internal References

- `plugins/provider-token-node/src/index.ts` — `providerTokenServiceRef` definition (scope change target)
- `plugins/provider-token-backend/src/DefaultProviderTokenService.ts` — refresh lock Map, `refreshTokenIfNeeded`, `getToken`
- `plugins/provider-token-backend/src/crypto.ts` — HKDF derivation, AES-256-GCM encrypt/decrypt
- `plugins/provider-token-backend/migrations/20260312000000_init_provider_tokens.js` — current schema
- `plugins/auth-backend-module-atlassian-token-capture/src/module.ts` — sign-in intercept pattern
- `plugins/atlassian-actions-backend/src/plugin.ts` — MCP consumer pattern

### External References

- [PostgreSQL advisory locks](https://www.postgresql.org/docs/current/functions-admin.html#FUNCTIONS-ADVISORY-LOCKS) — `pg_try_advisory_xact_lock` semantics
- [Backstage `createServiceRef` scopes](https://backstage.io/docs/backend-system/architecture/services) — `'root'` vs `'plugin'`
- [Atlassian OAuth 2.0 token rotation](https://developer.atlassian.com/cloud/jira/platform/oauth-2-3lo-apps/#use-a-refresh-token-to-get-another-access-token-and-refresh-token-pair) — confirms single-use refresh tokens
- [HKDF RFC 5869](https://datatracker.ietf.org/doc/html/rfc5869) — salt recommendations (§3.1)
