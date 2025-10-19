# Add Refresh Token Support to Auth Backend

## Overview

Implement refresh token sessions for Backstage identity tokens with rotation, database persistence, configurable lifetimes, and automatic cleanup. Refresh tokens will only be issued when `offline_access` scope is requested, storing user entity ref with computed ownership on refresh.

## Database Schema

**New migration**: `plugins/auth-backend/migrations/20251020000000_offline_sessions.js`

```javascript
// @ts-check

/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('offline_sessions', table => {
    table.comment(
      'Offline sessions for refresh tokens in dynamic client registration and device auth flows',
    );

    table
      .string('id')
      .primary()
      .notNullable()
      .comment('Persistent session ID that remains across token rotations');

    table
      .string('user_entity_ref')
      .notNullable()
      .comment('Backstage user entity reference');

    table
      .string('oidc_client_id')
      .nullable()
      .comment('OIDC client identifier (optional, for OIDC flows)');

    table
      .string('token_hash')
      .notNullable()
      .comment('Current refresh token hash (scrypt)');

    table
      .timestamp('created_at', { useTz: true, precision: 0 })
      .notNullable()
      .defaultTo(knex.fn.now())
      .comment('Session creation timestamp');

    table
      .timestamp('last_used_at', { useTz: true, precision: 0 })
      .notNullable()
      .defaultTo(knex.fn.now())
      .comment('Last token refresh timestamp');

    table
      .foreign('oidc_client_id')
      .references('client_id')
      .inTable('oidc_clients')
      .onDelete('CASCADE');
    table.index('user_entity_ref', 'offline_sessions_user_idx');
    table.index('created_at', 'offline_sessions_created_idx');
    table.index('last_used_at', 'offline_sessions_last_used_idx');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTable('offline_sessions');
};
```

**Note**: Session expiration is computed at runtime checking both:

- **Short window**: `last_used_at + tokenLifetime` (30 days default) - tokens cannot be refreshed after this
- **Long window**: `created_at + maxRotationLifetime` (1 year default) - session hard limit

The global `last_used_at` index enables efficient cleanup of idle sessions.

## Configuration

Add to `plugins/auth-backend/config.d.ts`:

```typescript
auth?: {
  refreshToken?: {
    /** Token lifetime before rotation required (default: 30 days) */
    tokenLifetime?: string;
    /** Maximum session lifetime across all rotations (default: 1 year) */
    maxRotationLifetime?: string;
  }
}
```

**Note**: Max tokens per user is hardcoded to 20 and not configurable.

## Core Implementation

### 1. Token Hashing Utilities (`plugins/auth-backend/src/lib/refreshToken.ts`)

- `generateRefreshToken(id: string)`: Generate cryptographically secure random token with embedded ID, return `{ token, hash }`
- `getRefreshTokenId(token: string)`: Extract the session ID from a refresh token
- `verifyRefreshToken(token: string, hash: string)`: Verify token against stored hash using scrypt
- Internal `hashToken(token: string)`: Hash using Node's built-in scrypt (not exported)

**Token format**: The token embeds the session ID so it can be extracted without database lookup. Format: `<id>.<random_bytes>`

### 2. Database Layer (`plugins/auth-backend/src/database/OfflineSessionDatabase.ts`)

- `createSession()`: Create new session with token hash, automatically delete existing session for same oidc_client_id if present, enforce per-user limit (20) by deleting LRU tokens
- `getSessionById()`: Find session by ID (extracted from token)
- `rotateToken()`: Update token_hash and last_used_at for a session
- `deleteSession()`: Remove session by ID
- `deleteSessionsByUserEntityRef()`: Remove all sessions for a user entity ref
- `cleanupExpiredSessions()`: Remove expired sessions based on both time windows
- `enforceUserLimit()`: Delete oldest sessions when user exceeds 20 tokens
- `deleteSessionByClientId()`: Remove session for specific oidc_client_id

### 3. OfflineAccessService (`plugins/auth-backend/src/service/OfflineAccessService.ts`)

New service to handle refresh token logic:

**`issueRefreshToken()`**:

- Accept user_entity_ref and optional oidc_client_id
- Generate new session ID
- Create refresh token using `generateRefreshToken(id)`
- Store session in database via `OfflineSessionDatabase.createSession()`
- Trigger stochastic cleanup (5% chance, non-blocking, max once per minute)
- Return refresh_token

**`refreshAccessToken()`**:

- Accept refresh_token and tokenIssuer
- Extract session ID using `getRefreshTokenId()`
- Fetch session using `getSessionById()`
- Check session exists and not expired (both time windows)
- Verify token hash using `verifyRefreshToken()`
- Derive fresh ownership references for the user via existing catalog mechanism (similar to how token issuance works)
- Issue new Backstage identity token with fresh ownership claims via `tokenIssuer.issueToken()`
- Generate new refresh token with same session ID
- Update database with new token hash via `rotateToken()`
- Trigger stochastic cleanup (5% chance, non-blocking, max once per minute)
- Return new access_token and refresh_token

**Private `triggerCleanup()`**:

- Check if cleanup ran in last 60 seconds using in-memory timestamp
- If yes, skip (deduplicate)
- If no, update timestamp and run `cleanupExpiredSessions()` asynchronously without blocking
- Catch and log any errors

**`revokeRefreshToken()`**:

- Accept refresh_token
- Extract session ID and delete session

**`revokeRefreshTokensByUserEntityRef()`**:

- Accept user_entity_ref
- Delete all sessions for the user via `deleteSessionsByUserEntityRef()`

### 4. OidcService Updates (`plugins/auth-backend/src/service/OidcService.ts`)

**In `exchangeCodeForToken()`**:

- Check if session.scope includes "offline_access"
- If yes, call `offlineAccessService.issueRefreshToken()` with user_entity_ref and client_id
- Return `refresh_token` in response alongside access_token

**New method `refreshAccessToken()`**:

- Delegate to `offlineAccessService.refreshAccessToken()`
- Return the result (access_token and refresh_token)

### 5. OidcRouter Updates (`plugins/auth-backend/src/service/OidcRouter.ts`)

**Update `/v1/token` endpoint**:

- Handle `grant_type === 'refresh_token'`
- Call `oidcService.refreshAccessToken()`
- Return new tokens with standard OAuth response

## Key Behaviors

1. **Rotation**: Each refresh invalidates current token, issues new one
2. **Lifetimes**: Individual token valid 30 days (configurable), session valid 1 year (configurable)
3. **Limits**: Max 20 per user, 1 per client - auto-delete LRU when exceeded
4. **Cleanup**: Stochastic (5% probability) on token operations + on user auth
5. **Scope**: Only issued when "offline_access" in authorization request
6. **Claims**: User entity ref stored; ownership refs computed fresh on each refresh

## Testing

Add comprehensive tests in:

- `plugins/auth-backend/src/lib/refreshToken.test.ts` - hashing utilities
- `plugins/auth-backend/src/database/RefreshTokenDatabase.test.ts` - database ops
- `plugins/auth-backend/src/service/OidcService.test.ts` - service logic
- `plugins/auth-backend/src/service/OidcRouter.test.ts` - endpoint integration

Test scenarios:

- Token generation, hashing, verification
- Session creation with limit enforcement
- Token rotation
- Expired token rejection
- User limit (20 tokens) enforcement
- Client limit (1 per client) enforcement
- Full OAuth flow: authorize → exchange → refresh
- Cleanup operations

## Files to Modify/Create

**New files**:

- `plugins/auth-backend/migrations/20251020000000_refresh_token_sessions.js`
- `plugins/auth-backend/src/lib/refreshToken.ts`
- `plugins/auth-backend/src/lib/refreshToken.test.ts`
- `plugins/auth-backend/src/database/RefreshTokenDatabase.ts`
- `plugins/auth-backend/src/database/RefreshTokenDatabase.test.ts`

**Modified files**:

- `plugins/auth-backend/config.d.ts`
- `plugins/auth-backend/src/service/OidcService.ts`
- `plugins/auth-backend/src/service/OidcService.test.ts`
- `plugins/auth-backend/src/service/OidcRouter.ts`
- `plugins/auth-backend/src/service/OidcRouter.test.ts`
- `plugins/auth-backend/src/service/router.ts` (initialize RefreshTokenDatabase)
