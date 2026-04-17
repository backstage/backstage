---
'@backstage/plugin-app': patch
---

Pinned `react-aria` and `react-stately` dependency ranges to use tilde instead of caret, targeting the v1.16.0 release line. React Aria does not strictly follow semver and may ship breaking changes in minor releases, so only patch-level updates are now picked up automatically.
