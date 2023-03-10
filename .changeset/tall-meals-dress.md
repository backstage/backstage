---
'@backstage/plugin-events-backend': patch
---

Export `DefaultEventBroker` to allow decoupling of the catalog and events backends in the `example-backend`.

Please look at `plugins/events-backend/README.md` for the currently advised way to set up the event backend and catalog providers.
