---
'@backstage/cli': patch
---

The frontend serve task now filters out allowed package duplicates during its package check, just like `versions:bump` and `versions:check`.
