---
'@backstage/ui': patch
---

Pinned `react-aria-components` dependency range to use tilde (`~1.16.0`) instead of caret, and added `react-stately` as a direct dependency. React Aria does not strictly follow semver and may ship breaking changes in minor releases, so only patch-level updates are now picked up automatically.
