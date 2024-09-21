---
'@backstage/cli': minor
---

**BREAKING**: Removed the following deprecated commands:

- `create`: Use `backstage-cli new` instead
- `create-plugin`: Use `backstage-cli new` instead
- `plugin:diff`: Use `backstage-cli fix` instead
- `test`: Use `backstage-cli repo test` or `backstage-cli package test` instead
- `versions:check`: Use `yarn dedupe` or `yarn-deduplicate` instead
- `clean`: Use `backstage-cli package clean` instead

In addition, the experimental `install` and `onboard` commands have been removed since they have not received any updates since their introduction and we're expecting usage to be low. If you where relying on these commands, please let us know by opening an issue towards the main Backstage repository.
