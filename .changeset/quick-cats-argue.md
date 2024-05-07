---
'@backstage/backend-test-utils': patch
'@backstage/backend-defaults': patch
'@backstage/plugin-events-node': patch
---

added `eventsServiceFactory` to `defaultServiceFactories` to resolve issue where different instances of the EventsServices could be used
