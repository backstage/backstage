---
'@backstage/plugin-scaffolder-backend-module-gitlab': patch
---

Fixed bug in gitlabRepoPush where it was looking in the wrong place in the exception response from gitbeaker when checking if the branch already exists
