---
'@backstage/plugin-auth-backend': patch
---

Fixed authorization-code exchanges to reject supplied client IDs that do not match the client that obtained the code. These requests return `invalid_grant` without consuming the code. Exchanges that omit `client_id` remain supported for older clients but now log a deprecation warning; a future release will require it.
