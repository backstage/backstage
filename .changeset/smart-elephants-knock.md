---
'@backstage/cli': patch
---

The `test` command now ensures that all IO is flushed before exiting when printing `--help`.
