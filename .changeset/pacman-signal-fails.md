---
'@backstage/cli-module-build': patch
'@backstage/cli-module-migrate': patch
'@backstage/cli-module-new': patch
---

Commands that run the package manager, such as the installs of `versions:bump` and `new` and the packing of `build-workspace`, now fail when a signal ends the package manager, rather than carry on as if it had succeeded.
