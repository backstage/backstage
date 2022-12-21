---
'@backstage/cli': patch
---

Fixed an issue where the CLI would fail to function when there was a mix of workspace and non-workspace versions of the same package in `yarn.lock` when using Yarn 3.
