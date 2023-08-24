---
'@backstage/core-app-api': minor
---

The `OAuth` class which is used by all OAuth providers will now consider both the session expiration of both the Backstage identity as well as the upstream identity provider, and refresh the session with either of them is about to expire.
