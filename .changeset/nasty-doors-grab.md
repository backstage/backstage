---
'@backstage/plugin-scaffolder-backend-module-azure': patch
---

Use `GitRepository.webUrl` instead of `GitRepository.remoteUrl` to set the value of `repoContentsUrl` as `remoteUrl` can sometimes return an URL with the wrong format (e.g. `https://<organization>@dev.azure.com/<organization>/<project>/\_git/<repository>`).
