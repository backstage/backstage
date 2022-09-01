---
'@backstage/cli': patch
---

The `versions:bump` command will now update dependency ranges in `package.json`, even if the new version is within the current range.
