---
'@backstage/cli-module-package-manager-yarn': patch
---

The `pm verify-patches` command now reports root-level Yarn resolutions that no longer match any dependency request in the lockfile.
