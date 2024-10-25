---
'@backstage/backend-dynamic-feature-service': minor
---

**BREAKING** The `dynamicPluginsFeatureLoader` options related to the root logger behavior (`transports`, `level`, `format`) are now gathered under a single `logger` option which is a function taking an optional `Config` argument and returning the logger options.

This breaking change is required for 2 reasons:

- it's totally possible that the current `Config` would be required to provide the logger options,
- the logger-related options should be gathered under a common `logger` option because, when the root auditing service is introduced, distinct but similarly-named options would be required for the auditor as well.
