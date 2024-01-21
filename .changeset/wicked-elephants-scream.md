---
'@backstage/plugin-azure-devops': patch
---

Prefer `dev.azure.com/build-definition` annotation when it is provided, as it is more specific than `dev.azure.com/project-repo`. This can also be used as a filter for mono-repos.
