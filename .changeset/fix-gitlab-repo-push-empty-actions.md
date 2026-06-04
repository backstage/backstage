---
'@backstage/plugin-scaffolder-backend-module-gitlab': patch
---

Fixed `gitlab:repo:push` failing with `400 Bad request - Provide at least one action` when the workspace has no file changes to commit (e.g. re-running a template against an already up-to-date branch). The action now detects an empty action list, skips the commit API call, and logs a warning. The `commitHash` output is omitted in this no-op case (the output is now declared optional); pass `allowEmpty: true` to retain the previous behavior of forwarding an empty commit to GitLab.
