---
'@backstage/core-app-api': minor
---

Fixed two bugs in how the `OAuth2Session` type represents the underlying data. The `expiresAt` and `backstageIdentity` are now both optional, since that's what they are in practice. This is not considered a breaking change since it was effectively a bug in the modelling of the state that this type represents, and the type was not used in any other external contract.
