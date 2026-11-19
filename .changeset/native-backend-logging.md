---
'@backstage/backend-defaults': minor
---

The default backend logger no longer depends on Winston. Added `DefaultRootLoggerService` and `DefaultRootAuditorService`, which continue to accept Winston 3 formats and transports. The existing Winston-named classes are deprecated aliases for the new implementations, and their option types remain available for existing custom implementations.

**BREAKING**: Printf-style interpolation using the logger's second argument is no longer supported, including when a custom `format.splat()` is supplied. The separate auditor's default formatter also no longer performs this interpolation. Interpolate values into the message before logging, and pass structured metadata separately.
