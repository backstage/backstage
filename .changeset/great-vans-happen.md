---
'@backstage/cli': patch
'@backstage/create-app': patch
'@backstage/plugin-catalog-backend': patch
'@backstage/plugin-catalog-import': patch
'@backstage/plugin-cloudbuild': patch
'@backstage/plugin-github-actions': patch
'@backstage/plugin-scaffolder-backend': patch
---

Get rid of all usages of @octokit/types, and bump the rest of the octokit dependencies to the latest version
