---
'@backstage/cli-common': patch
---

Fixed `runCheck` to ignore stdio of the spawned process, preventing unwanted output from leaking to the terminal.
