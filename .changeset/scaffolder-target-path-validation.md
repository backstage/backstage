---
'@backstage/plugin-scaffolder-backend-module-gitlab': patch
'@backstage/plugin-scaffolder-backend-module-github': patch
---

Validates the `targetPath` input of the `gitlab:repo:push`, `publish:gitlab:merge-request` and `publish:github:pull-request` scaffolder actions, and the `filesToDelete` entries of `publish:github:pull-request`. The values must be relative paths within the target repository; absolute paths and paths containing `..` segments are now rejected, so changes are only applied inside the intended subdirectory of the repository.
