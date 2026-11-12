---
'@backstage/cli-common': patch
---

`runOutput` now fails when a signal ends the command, since the output may be incomplete. Before, it returned whatever the command had written so far. `run` and its `waitForExit` still resolve in that case.
