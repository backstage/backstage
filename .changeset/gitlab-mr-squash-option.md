---
'@backstage/plugin-scaffolder-backend-module-gitlab': patch
---

Added an optional `squash` input to the `publish:gitlab:merge-request` action to control whether commits are squashed when the merge request is merged. When omitted, the GitLab project's squash setting is respected.
