---
'@backstage/plugin-scaffolder-backend-module-gitea': minor
'@backstage/plugin-scaffolder-backend': minor
'@backstage/plugin-scaffolder-node': minor
'@backstage/integration': patch
---

Created a gitea module for the scaffolder. This module provides a new action "publish:gitea" able to create a gitea repository owned by an organization. See: https://gitea.com/api/swagger#/organization/createOrgRepo

Fixed the gitea authorization headers (used by the integration module) to lower case the words: token and basic

Added a new test case to the integration module to verify the url of the gitea repository created by the getGiteaFileContentsUrl function.

Verifying if the basicURL processed by the readGiteaConfig function is valid
