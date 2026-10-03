---
'@backstage/plugin-events-backend-module-gitea': minor
---

Adds a new module `gitea` for `plugin-events-backend`.

The module registers an HTTP POST ingress for the topic `gitea` which validates the signature of incoming Gitea webhook requests against the secret configured at `events.modules.gitea.webhookSecret`. The webhook listener is only enabled if the secret is configured.
