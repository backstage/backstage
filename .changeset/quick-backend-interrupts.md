---
'@backstage/cli-node': patch
---

Backends launched by the development CLI now exit immediately on Ctrl-C without running shutdown hooks. Graceful shutdown on restart and signal handling outside the development CLI are unchanged.
