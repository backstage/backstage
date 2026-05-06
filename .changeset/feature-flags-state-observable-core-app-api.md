---
'@backstage/core-app-api': patch
---

`LocalStorageFeatureFlags` now implements the new `FeatureFlagsApi.state$()`
method, exposing an observable that emits the set of currently active flags on
subscription and again whenever `save()` is called. Subscribers can use this to
refresh UI driven by feature flags without requiring a page reload.
