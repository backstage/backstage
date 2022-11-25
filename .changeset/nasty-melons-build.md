---
'@backstage/plugin-events-backend-module-github': patch
---

Add `createGithubSignatureValidator(config)` which can be used
to create a validator used at an ingress for topic `github`.

On top, there is a new `githubWebhookEventsModule` for the new backend plugin API
which auto-registers the `HttpPostIngress` for topic `github` incl. the validator.

Please find more information at
https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-github/README.md.
