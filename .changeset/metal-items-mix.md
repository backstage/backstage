---
'@backstage/backend-common': minor
---

**BREAKING**: Server-to-server tokens that are authenticated by the `ServerTokenManager` now must have an `exp` claim that has not expired. Tokens where the `exp` claim is in the past or missing are considered invalid and will throw an error. This is a followup to the deprecation from the `1.2` release of Backstage where perpetual tokens were deprecated. Be sure to update any usage of the `getToken()` method to have it be called every time a token is needed. Do not store tokens for later use.
