---
'@backstage/plugin-catalog-backend-module-gitlab': patch
---

Fixed GitLab catalog discovery for branches containing slashes by escaping the branch name in generated catalog-file locations.
