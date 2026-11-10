---
'@backstage/errors': minor
---

Added static type guards such as `AuthenticationError.is(value)` and `ResponseError.is(value)` to narrow unknown errors by name and basic shape across package copies.

Added an `isErrorWithName(value, name)` helper for implementing custom error guards. `CustomErrorBase` and `ForwardedError` have no public `is` guard; forwarded errors are recognized by their preserved error names.
