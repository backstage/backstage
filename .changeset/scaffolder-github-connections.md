---
'@backstage/plugin-scaffolder-backend-module-github': patch
---

Allow the GitHub Scaffolder actions to resolve credentials from dedicated Connections. The module declares the GitHub connection type and creates its credentials provider from the connections service, so Scaffolder actions can run with a GitHub App scoped to the Scaffolder plugin instead of a shared integration credential.
