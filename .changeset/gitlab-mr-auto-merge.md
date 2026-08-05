---
'@backstage/plugin-scaffolder-backend-module-gitlab': patch
---

Added an `autoMerge` boolean input to the `publish:gitlab:merge-request` scaffolder action. When set to `true`, the merge request is automatically merged once all merge checks succeed, using GitLab's auto-merge feature.
