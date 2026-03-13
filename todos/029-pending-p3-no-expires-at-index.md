---
status: pending
priority: p3
issue_id: '029'
tags: [code-review, database, performance]
dependencies: ['027']
---

# 029 — No `expires_at` index on `provider_tokens` — future range queries require full table scan

## Problem Statement

The `provider_tokens` migration creates two indexes:

1. Composite PK on `(user_entity_ref, provider_id)` — used by all current queries
2. Single-column index on `user_entity_ref` — used by `deleteTokens(userEntityRef)` (bulk delete for sign-out)

There is no index on `expires_at`. Current queries use only the composite PK (exact lookup by
user + provider), so there is no immediate performance problem. However, natural follow-on
features will require range queries on `expires_at`:

- **Background refresh job**: `SELECT ... WHERE expires_at < NOW() + INTERVAL '5 minutes' AND refresh_token IS NOT NULL` — pre-warm tokens before users experience a latency spike
- **Cleanup job** (see todo #015): `DELETE FROM provider_tokens WHERE expires_at < NOW() - INTERVAL '30 days'`
- **Audit query**: `SELECT COUNT(*) FROM provider_tokens WHERE created_at > NOW() - INTERVAL '7 days'`

Without an index, each of these is a full table scan. At 50,000 rows (5,000 users × 10 providers
average), a full scan completes in ~50ms — acceptable today. At 500,000 rows it becomes
a 500ms+ blocking operation.

**Note also:** The standalone `user_entity_ref` index (column only) may be partially redundant
with the composite PK, since the PK already covers `user_entity_ref` as its leading column.
Most databases can use the composite PK index for queries that filter only on `user_entity_ref`
(range scan on leading column). Verify whether the standalone index provides any benefit over
the PK before keeping it.

## Findings

- **`plugins/provider-token-backend/migrations/20260312000000_init_provider_tokens.js`**: No `expires_at` index
- **`plugins/provider-token-backend/migrations/20260312000000_init_provider_tokens.js`**: Standalone `user_entity_ref` index — may be redundant with composite PK

## Proposed Solution

Add `expires_at` index in a follow-up migration:

```javascript
exports.up = async knex => {
  await knex.schema.table('provider_tokens', table => {
    table.index(['expires_at'], 'provider_tokens_expires_at_idx');
  });
};
```

Evaluate the standalone `user_entity_ref` index. If the DB engine can use the composite PK for
`deleteTokens`-style queries (DELETE WHERE user_entity_ref = ?), drop the redundant index to
reduce write overhead on every `upsertToken` call.

## Files to Change

- New migration file in `plugins/provider-token-backend/migrations/` (can be combined with todo #027's migration)
