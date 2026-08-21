---
'@backstage/cli-module-yarn': patch
'@backstage/cli-defaults': patch
---

Added `@backstage/cli-module-yarn` with `backstage-cli repo
verify-yarn-patches` to validate Yarn patch references, local patch files,
lockfile consistency, and patched Backstage package versions against the
selected Backstage release. The command is included in
`@backstage/cli-defaults`.
