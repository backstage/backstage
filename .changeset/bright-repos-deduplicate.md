---
'@backstage/plugin-catalog-backend-module-bitbucket-server': patch
---

Prevent Bitbucket Server discovery from generating duplicate catalog locations when a repository is returned more than once, while reporting conflicting entities with the same reference and their source repositories instead of silently choosing one.
