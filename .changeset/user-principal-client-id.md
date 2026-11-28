---
'@backstage/backend-plugin-api': minor
---

Added an optional `clientId` to `BackstageUserPrincipal`. It holds the ID of the OAuth client that the user's token was issued to, for example an MCP client that the user approved, and is not set for an interactive sign-in.
