---
'@backstage/plugin-scaffolder-backend-module-gitlab': patch
---

Added an optional `squash` input to `publish:gitlab:merge-request`. When omitted, merge requests use the GitLab project's squash setting. Explicit `true` and `false` values are passed to GitLab, subject to project policies.
