---
'@backstage/plugin-scaffolder-backend-module-gitlab': patch
---

Fixed `gitlab:group:ensureExists` failing with "Bad Request" when the path is a GitLab username. The action now returns the id of the user's namespace instead of trying to create a group with the same name.
