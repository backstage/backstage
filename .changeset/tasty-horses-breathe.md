---
'@backstage/cli': patch
---

Added a new `--publish` flag to the `repo fix` command. This command will validate and if possible generate the metadata required for publishing packages with the Backstage CLI. In addition, a check has been added that the `backstage.pluginId` and `backstage.pluginPackage(s)` fields are present when packing a package for publishing.
