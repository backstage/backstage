---
'@backstage/plugin-catalog-backend-module-github-org': patch
'@backstage/plugin-catalog-backend-module-github': patch
---

Introduce new configuration option to exclude suspended users from GitHub Enterprise instances.

When it’s set to true, suspended users won’t be returned when querying the organization users for GitHub Enterprise instances.
Note that this option should be used only against GitHub Enterprise instances, the property does not exist in the github.com GraphQL schema, setting it will cause a schema validation error and the syncing of users will fail.
