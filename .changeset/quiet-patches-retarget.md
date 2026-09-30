---
'@backstage/cli-module-package-manager-yarn': patch
---

Added a conservative `--fix` mode to `backstage-cli pm verify-patches` that can
update project-owned Backstage package patches when an automated release
upgrade leaves them pinned to older versions. The repair requires Yarn 3 or
later.
