---
status: pending
priority: p3
issue_id: '027'
tags: [code-review, database, observability]
dependencies: []
---

# 027 — DB schema lacks `created_at` column — impossible to audit or query by sign-in age

## Problem Statement

The `provider_tokens` table has `updated_at` (set on every upsert) but no `created_at` column.
This makes it impossible to answer operational questions such as:

- "When did this user first connect their Atlassian account?"
- "Which tokens have not been refreshed in 90 days?" (stale sessions)
- "How many new Atlassian sign-ins occurred in the past week?"

Without `created_at`, sign-in age must be inferred from `expires_at` (unreliable — depends on
token lifetime, not sign-in time) or from application logs (if any).

The missing column also makes the cleanup job suggested in todo #015 harder to implement —
cleanup based on `updated_at < N days ago` will accidentally delete tokens that were created
recently but never refreshed (no `updated_at` change since creation).

## Findings

- **`plugins/provider-token-backend/migrations/20260312000000_init_provider_tokens.js`**: No `created_at` column in the table definition
- **`plugins/provider-token-backend/src/DefaultProviderTokenService.ts` line 59**: `upsertToken` sets `updated_at: this.db.fn.now()` but has no `created_at` equivalent

## Proposed Solution

Add a follow-up migration that adds `created_at` with a default of `CURRENT_TIMESTAMP`, not
updated on subsequent upserts (unlike `updated_at`). Use Knex's `defaultTo(knex.fn.now())` so
it is set automatically on INSERT:

```javascript
// New migration file: 20260313000000_add_created_at_to_provider_tokens.js
exports.up = async knex => {
  await knex.schema.table('provider_tokens', table => {
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
  });
};
exports.down = async knex => {
  await knex.schema.table('provider_tokens', table => {
    table.dropColumn('created_at');
  });
};
```

In `upsertToken`, do NOT include `created_at` in the `.merge([...])` list — it should be set
only on initial INSERT:

```typescript
await this.db('provider_tokens')
  .insert({
    user_entity_ref: userEntityRef,
    provider_id: providerId,
    // ...
    created_at: this.db.fn.now(), // set on insert
    updated_at: this.db.fn.now(),
  })
  .onConflict(['user_entity_ref', 'provider_id'])
  .merge([
    'access_token',
    'refresh_token',
    'scope',
    'expires_at',
    'updated_at',
  ]);
// ← created_at intentionally excluded from merge list
```

## Files to Change

- New migration file in `plugins/provider-token-backend/migrations/`
- `plugins/provider-token-backend/src/DefaultProviderTokenService.ts` — keep `created_at` out of `.merge()` list
