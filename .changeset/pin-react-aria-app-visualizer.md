---
'@backstage/plugin-app-visualizer': patch
---

Pinned `react-aria-components` dependency range to use tilde (`~1.16.0`) instead of caret. React Aria does not strictly follow semver and may ship breaking changes in minor releases, so only patch-level updates are now picked up automatically.
