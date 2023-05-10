---
'@backstage/plugin-jenkins-backend': minor
'@backstage/plugin-jenkins': minor
---

Updated rebuild to use Jenkins API replay build, which works for Jenkins jobs that have required parameters. Jenkins SDK could not be used for this request because it does not have support for replay.

Added link to view build in Jenkins CI/CD table action column.
