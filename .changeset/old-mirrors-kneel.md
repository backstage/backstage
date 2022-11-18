---
'@backstage/plugin-scaffolder-backend': minor
---

Added a new scaffolder-backend action 'bitbucket-cloud:repo:create'.
This new action is essentially a clone of the 'publish:bitbucket-cloud' action. The idea is to write a few new actions for better support into Bitbucket Cloud.

The new 'bitbucket-cloud:repo:create' adds functionality to enable bitbucket pipelines (CI/CD) on a repository at creation
