---
'@backstage/cli-node': patch
---

Invoking a command that no installed CLI module provides now exits with code `69` instead of `1`, so that scripts and tools can tell a missing command apart from a command that failed.
