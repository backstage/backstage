---
'@backstage/core-app-api': minor
'@backstage/core-plugin-api': minor
'@backstage/test-utils': minor
---

**BREAKING**: Removed the deprecated `get` method from `StorageAPI` and its implementations, this method has been replaced by the `snapshot` method. The return value from snapshot no longer includes `newValue` which has been replaced by `value`. For getting notified when a value changes, use `observe$`.
