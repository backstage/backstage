---
'@backstage/cli': patch
'@backstage/cli-common': patch
---

Keep backstage.json in sync

The `versions:bump` script now takes care about updating the `version` property inside `backstage.json` file. The file is created if is not present.
