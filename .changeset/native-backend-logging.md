---
'@backstage/backend-defaults': patch
---

The default backend logger no longer depends on Winston. Added `DefaultRootLoggerService` and `DefaultRootAuditorService`, which continue to accept Winston 3 formats and transports. The existing Winston-named classes are deprecated aliases for the new implementations, and their option types remain available for existing custom implementations. Existing logger configuration and output formats remain supported.
