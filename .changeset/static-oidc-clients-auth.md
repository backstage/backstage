---
'@backstage/plugin-auth-backend': minor
---

Added support for pre-registered OAuth clients through the new `auth.staticClients` configuration. This allows integrations that support neither Client ID Metadata Documents nor Dynamic Client Registration to act on behalf of signed-in users using a fixed client ID, an optional client secret, and exact redirect URIs. All clients must use PKCE. Clients with a secret must also authenticate at the token endpoint.

The token endpoint verifies client credentials for both authorization code and refresh token grants. Missing or incorrect credentials for confidential clients return `invalid_client` with HTTP 401. Public clients can identify themselves using HTTP Basic with an empty secret. Codes issued to a different client are rejected.

Removing a configured client rejects its outstanding authorization codes and refresh tokens. HTTP Basic authentication supports form-encoded client IDs and secrets.

PKCE now requires the `S256` challenge method for all clients, including existing CIMD clients. The `plain` method is no longer accepted or advertised. Update clients that use `plain` to generate SHA-256 challenges.
