---
'@backstage/cli': patch
---

A CLI module that is installed individually and registers a `package` command with an `if` condition no longer replaces the matching default command. The default command remains available for packages where the installed module is not enabled.
