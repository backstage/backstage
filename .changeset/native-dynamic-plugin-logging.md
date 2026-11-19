---
'@backstage/backend-dynamic-feature-service': minor
---

Dynamic plugin logging now uses the default backend logger without a direct Winston dependency. Custom Winston 3 formats and transports remain supported. The dynamic-plugin logger's default production JSON output now includes timestamps, matching the regular backend logger, which already included them. Development logs already included timestamps.

**BREAKING**: Printf-style interpolation using the logger's second argument is no longer supported, including when a custom `format.splat()` is supplied. Interpolate values into the message before logging, and pass structured metadata separately.
