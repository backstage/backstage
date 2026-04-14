---
'@backstage/plugin-mcp-actions-backend': patch
---

Fixed the `.well-known/oauth-protected-resource` resource URL to comply with
[RFC 9728 Section 7.3](https://datatracker.ietf.org/doc/html/rfc9728#name-impersonation-attacks). Enabling dynamic resource paths.
