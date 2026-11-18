---
'@backstage/plugin-auth-backend-module-cloudflare-access-provider': patch
---

The Cloudflare Access auth provider now caches the user identity information fetched from Cloudflare per access token rather than per user, and no longer than one minute or until the token expires. This makes sure that changes to the identity, such as group membership, are reflected when users sign in again with a new token.
