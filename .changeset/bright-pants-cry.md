---
'@backstage/cli': patch
---

Fixing the error `Error: No existing version was accepted for range ^0.12.0, searching through 0.11.2,0.0.0-use.local, for package @backstage/core-components`, which can happen when there are multiple matching versions for a package, and one of them uses `workspace:^` as its range.
