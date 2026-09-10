---
'@backstage/plugin-scaffolder-backend': patch
---

Improved task worker resilience by backing off repeated database claim failures, containing unexpected task execution errors, and preventing new work from being claimed during graceful shutdown.
