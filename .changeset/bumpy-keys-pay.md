---
'@backstage/plugin-scaffolder-backend-module-gitlab': patch
---

Added new `gitlab:group:access` scaffolder action to add or remove users and groups as members of GitLab groups. The action supports specifying members via `userIds` and/or `groupIds` array parameters, configurable access levels (Guest, Reporter, Developer, Maintainer, Owner), and defaults to the 'add' action when not specified.
