---
'@backstage/plugin-scaffolder-backend-module-gitlab': patch
---

Fixed `gitlab:group:ensureExists` failing when its path refers to an existing GitLab user namespace. The action now returns the namespace ID without attempting to create a group, and reports a clear error when the path requests subgroups under a user namespace.
