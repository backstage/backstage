---
'@backstage/plugin-events-backend-module-github': patch
'@backstage/plugin-events-backend-module-gitlab': patch
---

Don't hard fail for not configuring `webhookSecret` for the GitHub and GitLab events backend. Instead, we don't add the ingress.
