---
'@backstage/cli': patch
---

Ignore `stdin` when spawning backend child process for the `start` command. Fixing an issue where backend startup would hang.
