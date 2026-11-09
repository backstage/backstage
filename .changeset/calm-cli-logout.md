---
'@backstage/cli-module-auth': patch
---

Fixed `auth logout` so that it revokes the refresh token on the server. Previously the revocation request was rejected because it did not identify the CLI client, which left the session valid until it expired.
