---
'@backstage/plugin-scaffolder-backend': minor
---

Adds an experimental workflow suspension action with manual and event triggers.
Waiting tasks release their workers, save their workspace, and resume through
task recovery. Includes an authenticated manual resume endpoint, timeout
handling, and an operator-controlled event topic allowlist.
