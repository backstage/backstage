---
'@backstage/plugin-scaffolder-backend': patch
---

Scaffolder tasks now wait for recovery checkpoint state to be persisted before continuing, preventing later execution from racing ahead of stored recovery state. Restored checkpoints also preserve falsy values without re-running their callbacks.
