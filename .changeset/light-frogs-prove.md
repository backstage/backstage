---
'example-backend': patch
'@backstage/plugin-jenkins-backend': patch
---

## Extract an entity-oriented Jenkins Backend

Change the Jenkins plugin from talking directly with a single jenkins instance (via the proxy) to having a specific
backend plugin which talks to the jenkins instances.
