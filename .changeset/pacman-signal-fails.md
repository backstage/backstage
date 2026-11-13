---
'@backstage/cli-module-build': patch
'@backstage/cli-module-migrate': patch
'@backstage/cli-module-new': patch
---

Commands that run the package manager, such as the install of `versions:bump` and the packing of `build-workspace`, now fail when a signal ends the package manager, rather than carry on as if it had succeeded. `new` stops and reports that it failed to create the package when it gets a signal, for example from Ctrl+C, while it installs or lints, rather than carry on and report success.
