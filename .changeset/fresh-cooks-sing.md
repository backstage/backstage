---
'@backstage/integration': minor
---

This patch brings Gitea as a valid integration: target, via the ScmIntegration interface. It adds gitea to the relevant static properties (get integration by name, get integration by type) for plugins to be able to reference the same Gitea server.
