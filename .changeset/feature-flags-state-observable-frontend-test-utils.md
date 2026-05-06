---
'@backstage/frontend-test-utils': patch
---

`MockFeatureFlagsApi` now implements the new `FeatureFlagsApi.state$()` method,
emitting a snapshot on subscription and after every `save`, `setState`, or
`clearState` call. Tests that rely on subscribing to flag changes can use the
mock directly without any extra wiring.
