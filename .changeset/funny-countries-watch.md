---
'@backstage/plugin-events-backend-module-github': minor
---

Adds a new module `github` to plugin-events-backend.

The module adds a new event router `GithubEventRouter`.

The event router will re-publish events received at topic `github`
under a more specific topic depending on their `x-github-event` value
(e.g., `github.push`).

Please find more information at
https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-github/README.md.
