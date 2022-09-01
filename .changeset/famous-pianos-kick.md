---
'@backstage/cli': patch
---

The `versions:bump` command will no update dependency ranges in `package.json`, even if the new version is within the current range.
