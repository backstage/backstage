---
'@backstage/plugin-scaffolder-backend-module-bitbucket-cloud': patch
---

Created getGitAuth helper function for Bitbucket-Cloud git-related calls. This updates the remaining calls that were missed in the recent update to add API token authentication and should now fully enable API token functionality for Bitbucket-Cloud.
