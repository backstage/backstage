---
'@backstage/plugin-events-backend-module-gitlab': patch
---

Add `createGitlabTokenValidator(config)` which can be used
to create a validator used at an ingress for topic `gitlab`.

On top, there is a new `gitlabWebhookEventsModule` for the new backend plugin API
which auto-registers the `HttpPostIngress` for topic `gitlab` incl. the validator.

Please find more information at
https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-gitlab/README.md.
