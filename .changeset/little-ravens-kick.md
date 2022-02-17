---
'@backstage/cli': patch
---

The `versions:bump` command now also considers the root `package.json` when searching for updates. It has also received updates to its output, including a link the [Backstage upgrade helper](https://backstage.github.io/upgrade-helper) and silenced `yarn install` output.
