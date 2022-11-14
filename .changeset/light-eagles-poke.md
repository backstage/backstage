---
'@backstage/plugin-events-backend-module-gerrit': minor
---

Adds a new module `gerrit` to plugin-events-backend.

The module adds a new event router `GerritEventRouter`.

The event router will re-publish events received at topic `gerrit`
under a more specific topic depending on their `$.type` value
(e.g., `gerrit.change-merged`).

Please find more information at
https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-gerrit/README.md.
