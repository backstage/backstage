---
'@backstage/repo-tools': patch
---

The commands of `backstage-repo-tools` now live in separate CLI module packages, which are loaded through the standard Backstage CLI module system. All commands and options are invoked in the same way as before, but the help output now uses the same format as the Backstage CLI.
