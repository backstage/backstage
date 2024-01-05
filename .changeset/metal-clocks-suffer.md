---
'@backstage/plugin-scaffolder-backend-module-gitea': minor
'@backstage/plugin-scaffolder-backend': minor
'@backstage/plugin-scaffolder-node': minor
'@backstage/integration': patch
---

Added support to create a git repository and publish a scaffolded project using a new action "publish:gitea" for gitea. The action currently supports to create a gitea repository owned by an organization. See: https://gitea.com/api/swagger#/organization/createOrgRepo
