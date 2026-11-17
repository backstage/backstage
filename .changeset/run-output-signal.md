---
'@backstage/cli-common': patch
---

`runOutput` now fails when a signal ends the command, since the output may be incomplete. Before, it returned whatever the command had written so far. The error has the name of the signal in its `signal` property. `run` and its `waitForExit` still resolve in that case.
