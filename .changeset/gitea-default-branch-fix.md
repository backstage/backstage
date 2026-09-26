---
'@backstage/plugin-catalog-backend-module-gitea': patch
---

Fixed the Gitea entity provider registering catalog-info.yaml locations against a hardcoded 'main' branch instead of each repository's actual default branch.
