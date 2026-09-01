---
'@backstage/cli-module-package-manager-yarn': patch
'@backstage/cli-defaults': patch
---

Added `@backstage/cli-module-package-manager-yarn` with `backstage-cli pm
verify-patches` to validate Yarn patch references, local patch files,
lockfile consistency, and patched Backstage package versions against the
selected Backstage release. The command is included in
`@backstage/cli-defaults`.
