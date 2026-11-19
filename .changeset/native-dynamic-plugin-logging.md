---
'@backstage/backend-dynamic-feature-service': patch
---

Dynamic plugin logging now uses the default backend logger without a direct Winston dependency. Custom Winston 3 formats and transports remain supported. The dynamic-plugin logger's default production JSON output now includes timestamps, matching the regular backend logger, which already included them. Development logs already included timestamps.
