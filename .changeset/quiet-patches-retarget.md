---
'@backstage/cli-module-package-manager-yarn': patch
'@backstage/cli-defaults': patch
---

Added a conservative `--fix` mode to `backstage-cli pm verify-patches` that can
update a project-owned Backstage package patch after a release upgrade when
the existing patch still applies cleanly.
