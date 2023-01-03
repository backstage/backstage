---
'@backstage/plugin-events-backend': patch
---

The default event broker will now catch and log errors thrown by the `onEvent` method of subscribers. The returned promise from `publish` method will also not resolve until all subscribers have handled the event.
