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
