---
'@backstage/plugin-scaffolder-backend': patch
---

The --no-node-snapshot check needs to be done against process.execArgv instead of process.argv
