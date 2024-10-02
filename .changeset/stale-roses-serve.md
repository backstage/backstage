---
'@backstage/plugin-events-node': patch
---

The default implementation of the `EventsService` now uses the new event bus for distributing events across multiple backend instances if the events backend plugin is installed.
