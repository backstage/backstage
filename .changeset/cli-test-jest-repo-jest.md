---
'@backstage/cli-module-test-jest': minor
---

**BREAKING**: The Jest-based `repo test` command has been renamed to `repo jest`. The `repo test` command is now provided by `@backstage/cli-module-test` and runs `package test` for each package separately. Update scripts that rely on watch mode, `--success-cache` or merged coverage to use `backstage-cli repo jest`.
