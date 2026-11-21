---
'@backstage/cli-module-package-manager-yarn': patch
---

`pm verify-patches --fix` now removes outdated `@backstage/*` patches whose changes are already included in the target release version. If an updated patch no longer applies, each patch is checked with `git apply --check -R` against the released package. A patch that reverse-applies in full is deleted along with its `resolutions` entry. Patches that only partly match are left for manual repair.
