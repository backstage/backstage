---
'@backstage/frontend-plugin-api': minor
---

**BREAKING PRODUCERS**: Added a required `state$()` method to `FeatureFlagsApi`.
The method returns an `Observable` that emits the set of currently active flag
names on subscription, and a fresh snapshot whenever `save()` is called. Use it
to react to feature flag changes without forcing a page reload, for example to
refresh navigation when a flag is toggled.

Custom implementations of `FeatureFlagsApi` need to add this method to remain
compatible. The default `LocalStorageFeatureFlags` and `MockFeatureFlagsApi`
implementations are updated.
