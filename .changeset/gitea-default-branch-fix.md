---
'@backstage/plugin-catalog-backend-module-gitea': patch
---

Fixed the Gitea entity provider registering catalog-info.yaml locations against a hardcoded 'main' branch instead of each repository's actual default branch. Repositories whose default branch isn't literally named 'main' (e.g. 'master', or any custom default) now resolve to their real default branch, matching the branch that was already used to confirm the catalog file exists. An explicitly configured `branch` in the provider config still overrides this and behaves as before.
