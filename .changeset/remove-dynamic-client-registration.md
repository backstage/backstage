---
'@backstage/plugin-auth-backend': minor
---

**BREAKING**: Removed experimental Dynamic Client Registration (DCR). Use Client ID Metadata Documents (CIMD) instead and remove `auth.experimentalDynamicClientRegistration` from your configuration. The database migration deletes registered clients and their authorization and offline sessions, invalidating existing DCR authorization codes and refresh tokens. Users must sign in again through a CIMD client. Already-issued user tokens remain valid until they expire. See the [migration guide](https://backstage.io/docs/ai/mcp-actions#migrating-from-dynamic-client-registration).
