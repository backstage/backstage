---
'@backstage/frontend-plugin-api': minor
---

Added support for conditionally rendering blueprints. You can now provide an `enabled` function with various criteria. Utility methods `allOf`, `anyOf` and `createFeatureFlagCondition` are provided for common use cases.
