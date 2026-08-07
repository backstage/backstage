---
'@backstage/plugin-events-backend-module-github': minor
'@backstage/plugin-events-backend-module-gitlab': minor
'@backstage/plugin-events-backend-module-azure': minor
---

Enforced secure-by-default webhook authentication. Webhook requests received on `/api/events/http/*` endpoints will now be rejected with an HTTP 403 Forbidden status code if no webhook secret is configured, unless the new configuration property `dangerouslyAllowUnauthenticatedEvents` is explicitly set to `true`.
