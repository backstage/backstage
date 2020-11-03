---
'@backstage/core-api': minor
---

Refactored the FeatureFlagsApi to make it easier to re-implement. Existing usage of particularly getUserFlags can be replaced with isActive() or save().
