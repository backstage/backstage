---
'@backstage/plugin-scaffolder-backend-module-gitlab': minor
---

The `gitlab:repo:push` template action no longer fails when there is nothing to commit, for example when the workspace is empty, when `sourcePath` yields no files, or when `commitAction: auto` skips every file because the branch already matches. In those cases the step now completes successfully, logs a warning that no commit was created, and the `commitHash` output is empty instead of calling GitLab and returning an error.
