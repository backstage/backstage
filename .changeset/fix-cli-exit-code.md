---
'@backstage/cli': patch
'@backstage/cli-node': patch
---

Fixed `process.exit(0)` to `process.exit()` so that exit codes set by command handlers (e.g. test failures) are properly propagated.
