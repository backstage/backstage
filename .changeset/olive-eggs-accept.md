---
'@backstage/backend-common': minor
---

**BREAKING**: Server-to-server authentication tokens issued from a
`TokenManager` (specifically, `ServerTokenManager`) now has an expiry time set,
for one hour in the future from when issued. This improves security.

It was always the case that users of this interface were expected to call its
`getToken()` method for every outgoing call and never hold on to any given token
for reuse. But this now has become even more important advice to heed, and you
should verify that you do not hold on to and reuse tokens such as these in your
own code.
