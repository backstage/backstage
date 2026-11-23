---
'@backstage/plugin-scaffolder-backend-module-gitlab': patch
---

Fixed `gitlab:group:ensureExists` failing when the owner path refers to a GitLab user namespace. The action now resolves the first path segment through the Namespaces API: an existing user namespace is reused instead of attempting to create a group with the same path, and requesting subgroups under a user namespace fails with a clear error.
