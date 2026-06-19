---
'@backstage/cli': minor
---

**BREAKING**: The CLI no longer includes or loads a default set of commands. Add `@backstage/cli-defaults` as a direct root dependency to retain all standard commands, or add selected `@backstage/cli-module-*` packages instead.
