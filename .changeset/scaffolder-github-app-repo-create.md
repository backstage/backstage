---
'@backstage/plugin-scaffolder-backend-module-github': patch
---

Fixed the `publish:github` and `github:repo:create` actions to request organization-level credentials when creating a repository, allowing GitHub Apps configured with "Only select repositories" to create new repositories.
