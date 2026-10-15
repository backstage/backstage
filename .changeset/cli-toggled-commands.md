---
'@backstage/cli': patch
---

A CLI module that is installed individually and provides a `package` command with an `isEnabled` check no longer replaces the matching default command. The default command remains available for packages where the installed module is not enabled.
