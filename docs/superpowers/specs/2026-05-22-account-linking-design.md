# Account Linking: Core Framework API Design

## Overview

Add a core framework API to Backstage that enables backend plugins to obtain third-party provider tokens (GitHub, Google, GitLab, etc.) on behalf of authenticated users. Users link external accounts through an explicit settings page, and admins control which plugins can access which provider tokens via configuration.

## Problem

Today, third-party OAuth tokens in Backstage live entirely in the browser. The frontend has per-provider OAuth APIs (e.g., `githubAuthApiRef.getAccessToken()`), but backend plugins have no standard way to obtain a provider token for the user behind an incoming request. Refresh tokens are stored in HTTP-only cookies with no server-side persistence.

This means:

- A backend plugin that needs to call GitHub on behalf of a user has no framework-supported path to do so.
- There's no concept of linking multiple external identities to a single Backstage user.
- There's no admin control over which plugins can access which provider tokens.

## Approach

New `AccountLinkingService` as a core backend service, with a separate account linking backend plugin for storage and token management. The service delegates OAuth operations to existing auth provider authenticators instead of building new ones. A frontend plugin provides a "Linked Accounts" settings page for users to manage their linked providers.

## Core Service Interface

Defined in `@backstage/backend-plugin-api`:

```ts
export interface AccountLinkingService {
  getToken(options: {
    credentials: BackstageCredentials;
    provider: string;
    scopes?: string[];
  }): Promise<{ token: string; expiresAt?: Date }>;

  getLinkedProviders(options: {
    credentials: BackstageCredentials;
  }): Promise<Array<{ provider: string; grantedScopes: string[] }>>;

  unlinkProvider(options: {
    credentials: BackstageCredentials;
    provider: string;
  }): Promise<void>;
}
```

Registered as `coreServices.accountLinking`.

### `getToken`

Accepts user credentials, a provider name, and optional scopes. Returns a fresh access token obtained by refreshing the stored refresh token against the provider's token endpoint. Access tokens are never stored — they're minted on demand.

Throws one of three errors:

- **`AccountNotLinkedError`** — the user hasn't linked this provider. Includes `provider`.
- **`InsufficientScopesError`** — the account is linked but missing requested scopes. Includes `provider`, `grantedScopes`, and `requestedScopes`.
- **`PolicyDeniedError`** — the calling plugin isn't allowed to access this provider or these scopes per admin config. This is a configuration problem, not user-resolvable.

### getLinkedProviders

Returns the list of providers the user has linked, with granted scopes for each. Used by the frontend settings page and by plugins that want to check before calling `getToken`.

### `unlinkProvider`

Removes the link between the user and the provider. Deletes the stored refresh token from the database.

## Auth Provider Integration

Defined in `@backstage/plugin-auth-node`:

```ts
export interface AccountLinkingProvider {
  start(options: {
    scopes: string[];
    callbackUrl: string;
  }): Promise<{ authorizationUrl: string; state: string }>;

  exchange(options: {
    code: string;
    state: string;
    callbackUrl: string;
  }): Promise<{ refreshToken: string; scopes: string[]; externalId: string }>;

  refresh(options: {
    refreshToken: string;
    scopes?: string[];
  }): Promise<{ accessToken: string; expiresAt?: Date; refreshToken?: string }>;
}
```

Auth provider modules register an `AccountLinkingProvider` alongside their existing authenticator. The `auth-node` package provides a helper that auto-creates an `AccountLinkingProvider` from an existing `OAuthAuthenticator`, so most providers get support with minimal code.

## Database Schema

A single table owned by the account linking backend plugin:

```sql
CREATE TABLE account_links (
  id UUID PRIMARY KEY,
  user_entity_ref VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  external_id VARCHAR(255),
  encrypted_refresh_token TEXT NOT NULL,
  granted_scopes TEXT NOT NULL,
  linked_at TIMESTAMP NOT NULL,
  last_used_at TIMESTAMP,

  UNIQUE(user_entity_ref, provider)
);
```

- One link per provider per user, enforced by the unique constraint.
- Only refresh tokens are stored, encrypted at rest using keys derived from the backend's signing key configuration. Old keys are retained for decryption during key rotation, following the same pattern as the existing `signing_keys` table.
- `external_id` stores the provider-specific user ID for debugging and to prevent two Backstage users from linking the same external account.
- `granted_scopes` tracks what scopes the user authorized, enabling fast "insufficient scopes" checks without a provider round-trip.
- Access tokens are never persisted.

## Admin Policy Configuration

Admins control which plugins can access which provider tokens in `app-config.yaml`. OAuth client configuration is reused from `auth.providers` — no duplication.

```yaml
accountLinking:
  policy:
    - provider: github
      allow:
        - pluginId: scaffolder
          scopes: [repo, read:org]
        - pluginId: catalog
          scopes: [read:org]
    - provider: google
      allow:
        - pluginId: '*'
          scopes: [openid, profile, email]
```

### Policy Enforcement

When a backend plugin calls the account linking service, it does so via a plugin request token that carries both the user's identity (on-behalf-of) and the calling plugin's service principal. The account linking backend extracts both from the incoming request and checks the policy before returning a token.

## Backend Routes

The account linking backend plugin exposes:

- `POST /api/account-linking/link/:provider/start` — initiates OAuth flow, returns authorization URL. Accepts desired scopes.
- `GET /api/account-linking/link/:provider/callback` — OAuth callback. Exchanges authorization code for tokens via the provider's `AccountLinkingProvider`, stores the encrypted refresh token, redirects back to the frontend.
- `GET /api/account-linking/links` — returns linked providers for the current user.
- `DELETE /api/account-linking/link/:provider` — removes a linked provider.
- `POST /api/account-linking/token` — backend-to-backend endpoint. Accepts plugin token + provider + scopes, enforces policy, returns a fresh access token.

## Frontend

A new `@backstage/plugin-account-linking` frontend plugin providing a "Linked Accounts" settings page:

- Lists providers available for linking, derived from configured auth providers.
- Shows which providers the current user has linked, with granted scopes.
- "Link" button triggers an OAuth popup flow, similar to the existing sign-in flow.
- "Unlink" button to disconnect a provider.
- Supports re-authorization with additional scopes when needed.

## Incremental Scope Handling

When a plugin calls `getToken` with scopes the user hasn't granted:

1. `getToken` throws `InsufficientScopesError` with `grantedScopes` and `requestedScopes`.
2. The frontend plugin that triggered the action catches this error.
3. The frontend directs the user to the linked accounts page to re-authorize with additional scopes.
4. On successful re-authorization, the backend updates `granted_scopes` and stores the new refresh token.

## Error Types

```ts
export class AccountNotLinkedError extends Error {
  readonly provider: string;
}

export class InsufficientScopesError extends Error {
  readonly provider: string;
  readonly grantedScopes: string[];
  readonly requestedScopes: string[];
}

export class PolicyDeniedError extends Error {
  readonly provider: string;
  readonly pluginId: string;
}
```

## Package Layout

| Package                                     | Contents                                                                  |
| ------------------------------------------- | ------------------------------------------------------------------------- |
| `@backstage/backend-plugin-api`             | `AccountLinkingService` interface, `coreServices.accountLinking` ref      |
| `@backstage/plugin-auth-node`               | `AccountLinkingProvider` interface, `createAccountLinkingProvider` helper |
| `@backstage/plugin-account-linking-backend` | Backend plugin: routes, database, policy enforcement, token refresh       |
| `@backstage/plugin-account-linking`         | Frontend plugin: linked accounts settings page                            |

## Security Considerations

- Refresh tokens encrypted at rest with key rotation support.
- Admin policy restricts which plugins can access which providers and scopes.
- Access tokens are never stored, only minted on demand.
- The `external_id` field prevents two Backstage users from linking the same external account.
- `PolicyDeniedError` is logged for audit purposes.
- The linking OAuth flow uses CSRF protection via state parameter validation.
