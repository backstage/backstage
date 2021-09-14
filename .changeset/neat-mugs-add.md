---
'@backstage/integration': patch
---

Fix Azure URL handling to properly support both repo shorthand (`/owner/_git/project`) and full URLs (`/owner/project/_git/repo`).

Fix Azure DevOps Server URL handling by being able to parse URLs with hosts other than `dev.azure.com`. Note that the `api-version` used for API requests is currently `6.0`, meaning you need to support at least this version in your Azure DevOps Server instance.
