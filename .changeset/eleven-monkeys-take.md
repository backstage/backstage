---
'@backstage/plugin-scaffolder-backend': minor
'@backstage/plugin-scaffolder-common': minor
'@backstage/plugin-scaffolder-node': patch
---

Added another retry method called `resume` which will automatically try to restart the task from the previously known good state rather than starting from the beginning and clearing existing state
