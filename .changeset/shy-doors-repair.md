---
'@backstage/plugin-auth-backend': minor
---

**BREAKING**: The setting `auth.omitIdentityTokenOwnershipClaim` has had its default value switched to `true`.

With this setting Backstage user tokens issued by the `auth` backend will no longer contain an `ent` claim - the one with the user's ownership entity refs. This means that tokens issued in large orgs no longer risk hitting HTTP header size limits.

To get ownership info for the current user, code should use the `userInfo` core service. In practice code will typically already conform to this since the `ent` claim has not been readily exposed in any other way for quite some time. But code which explicitly decodes Backstage tokens - which is strongly discouraged - may be affected by this change.

The setting will remain for some time to allow it to be set back to `false` if need be, but it will be removed entirely in a future release.
