---
'@backstage/plugin-scaffolder-backend': minor
---

Added `always()` and `failure()` status check functions for scaffolder steps. These functions can be used in the if field of a step to control execution after failures. `always()` ensures a step runs regardless of previous step outcomes, while `failure()` runs a step only when a previous step has failed.
