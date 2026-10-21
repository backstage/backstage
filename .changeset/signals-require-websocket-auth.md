---
'@backstage/plugin-signals-backend': patch
---

The signals WebSocket endpoint now requires a valid user identity token. The token can appear anywhere in the requested WebSocket protocols. Connections without a token, with an invalid token, or with a non-user (service) token are rejected, and unauthenticated guest connections are no longer accepted.
