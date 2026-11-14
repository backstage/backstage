---
'@backstage/plugin-events-backend-module-github': minor
'@backstage/plugin-events-backend-module-gitlab': minor
'@backstage/plugin-events-backend-module-azure': minor
---

**BREAKING** Webhook events modules now require a webhook secret by default. Requests to the `/api/events/http/github`, `/api/events/http/gitlab`, and `/api/events/http/azureDevOps` endpoints are rejected with HTTP 403 when no webhook secret is configured, instead of being accepted without validation. To continue accepting unauthenticated events, for example in development environments, set the module's new `dangerouslyAllowUnauthenticatedEvents` option to `true`. In addition, the `createGitlabTokenValidator` function from `@backstage/plugin-events-backend-module-gitlab` now requires a `logger` argument.
