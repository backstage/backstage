---
'@backstage/plugin-auth-backend': patch
---

Added support for pre-registered OAuth clients through the new `auth.staticClients` configuration. This allows integrations that support neither Client ID Metadata Documents nor Dynamic Client Registration to act on behalf of signed-in users using a fixed client ID, an optional client secret, and exact redirect URIs. Clients without a secret are treated as public clients and must use PKCE.

The token endpoint now also verifies client credentials when they are provided with an `authorization_code` grant, and rejects codes that were issued to a different client.

Removing a configured client rejects its outstanding authorization codes and refresh tokens. HTTP Basic authentication supports form-encoded client IDs and secrets.
