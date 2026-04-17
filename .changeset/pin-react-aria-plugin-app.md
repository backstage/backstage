---
'@backstage/plugin-app': patch
---

Replaced scoped `@react-aria/*` and `@react-stately/*` dependencies with pinned `react-aria` (`~3.47.0`) and `react-stately` (`~3.45.0`) umbrella packages. React Aria does not strictly follow semver and may ship breaking changes in minor releases, so only patch-level updates are now picked up automatically.
