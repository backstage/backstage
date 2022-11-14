---
'@backstage/plugin-events-backend': minor
'@backstage/plugin-events-node': minor
---

Support events received via HTTP endpoints at plugin-events-backend.

The plugin provides an event publisher `HttpPostIngressEventPublisher`
which will allow you to receive events via
HTTP endpoints `POST /api/events/http/{topic}`
and will publish these to the used event broker.

Using a provided custom validator, you can participate in the decision
which events are accepted, e.g. by verifying the source of the request.

Please find more information at
https://github.com/backstage/backstage/tree/master/plugins/events-backend/README.md.
