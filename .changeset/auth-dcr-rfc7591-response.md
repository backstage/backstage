---
'@backstage/plugin-auth-backend': patch
---

Fixed Dynamic Client Registration to honor the requested `token_endpoint_auth_method` when the server advertises it, so public clients registering with `none` no longer receive a client secret and are required to use PKCE. The registration response now includes the client metadata required by RFC 7591, and only lists the grant and response types the server supports.
