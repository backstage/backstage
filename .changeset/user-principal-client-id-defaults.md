---
'@backstage/backend-defaults': patch
---

User credentials now expose the OAuth client that the user's token was issued to as `principal.clientId`, and the client is kept when a backend plugin makes requests on behalf of the user. Audit events include it as `actor.clientId`, and permission policies can read it from the user credentials, which makes it possible to tell requests from an MCP client apart from the same user's own session.
