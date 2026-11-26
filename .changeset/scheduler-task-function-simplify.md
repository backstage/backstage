---
'@backstage/backend-plugin-api': patch
---

Simplified the `SchedulerServiceTaskFunction` type to a single signature that receives an abort signal. Task functions that ignore the signal are still accepted.
