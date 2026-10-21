---
id: offline-access
title: Offline Access
description: How to enable long-lived sessions with refresh tokens for the Backstage CLI and MCP clients, and how to revoke them
---

By default, a Backstage user token is short-lived. Clients that sign in through
the auth backend's OAuth flow, such as the [Backstage CLI](../tooling/cli/module-auth.md)
and [MCP clients](../ai/mcp-actions.md#oauth-authentication), can also ask for
offline access with the `offline_access` scope. They then receive a refresh
token, which lets them get new user tokens without the user signing in again.

Each refresh token belongs to an offline session that is stored in the auth
backend database.

## Enabling offline access

Offline access is turned off by default. Enable it in your `app-config.yaml`:

```yaml title="app-config.yaml"
auth:
  experimentalRefreshToken:
    enabled: true
```

When it is turned off, clients that ask for the `offline_access` scope still sign
in, but they do not receive a refresh token.

## Configuring session lifetimes

The following options are available under `auth.experimentalRefreshToken`:

| Option                                   | Default   | Description                                                                                                                            |
| ---------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `tokenLifetime`                          | `30 days` | How long a refresh token stays valid without being used. Each use replaces the refresh token with a new one.                           |
| `maxRotationLifetime`                    | `1 year`  | The maximum lifetime of a session, no matter how often it is used. After this, the user must sign in again.                            |
| `maxTokensPerUser`                       | `20`      | The maximum number of sessions per user. When the limit is reached, the least recently used session is removed.                        |
| `dangerouslyDisableCatalogPresenceCheck` | `false`   | Turns off the check that the user still exists in the catalog when a token is refreshed. See [below](#users-removed-from-the-catalog). |

A client gets at most one session per user. Signing in again with the same
client replaces its previous session.

## Ending sessions

### Signing out from a client

A client can revoke its own refresh token through the standard revocation
endpoint, `/api/auth/v1/revoke`. For example, `backstage-cli auth logout` does
this before removing the tokens it stores locally.

### Revoking all sessions of a user

Other backend services can revoke all offline sessions of a user at once, for
example when an administrator needs to sign a user out of every client. Send a
`POST` request to `/api/auth/v1/offline-sessions/revoke` with the user entity
reference in the body:

```json
{ "userEntityRef": "user:default/jane.doe" }
```

The response contains the number of revoked sessions, for example
`{ "revokedCount": 2 }`. Every revocation is recorded as an audit event.

Only [service credentials](./service-to-service-auth.md) are accepted, so users
cannot call this endpoint directly. The calling service is responsible for
checking that the request is allowed, for example by only exposing it to
administrators.

### Users removed from the catalog

When a token is refreshed, the auth backend checks that the user entity still
exists in the catalog. If it does not, the session is revoked and the refresh
fails. If your Backstage instance allows
[sign-in without users in the catalog](./identity-resolver.md#sign-in-without-users-in-the-catalog),
you can set `dangerouslyDisableCatalogPresenceCheck` to turn off this check.
Without it, sessions of removed users stay valid until they expire.

### Access tokens that were already issued

Revoking a session stops the client from getting new user tokens. User tokens
that were already issued stay valid until they expire. You can shorten how long
they are valid with
[`auth.backstageTokenExpiration`](https://github.com/backstage/backstage/blob/master/plugins/auth-backend/README.md#configuring-token-expiration-in-app-config).
