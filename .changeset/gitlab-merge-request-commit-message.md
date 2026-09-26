---
'@backstage/plugin-scaffolder-backend-module-gitlab': patch
---

The `publish:gitlab:merge-request` action now accepts an optional `commitMessage` input to set the message of the commit created on the source branch. When omitted, the merge request title continues to be used as the commit message.
