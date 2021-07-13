---
'@backstage/plugin-scaffolder-backend': minor
---

Updated inputs for the `publish:github:pull-request` action.

Now requires a `repoUrl` instead of separate `owner` and `repo` inputs. This aligns with the output of the `RepoUrlPicker` ui field used by the pull-request sample template.
