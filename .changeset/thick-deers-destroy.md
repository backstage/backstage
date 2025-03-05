---
'@backstage/cli': patch
---

Fix a bug in the translation of the deprecated `--scope` option for the `new` command that could cause plugins to have `backstage-backstage-plugin` in their name.
