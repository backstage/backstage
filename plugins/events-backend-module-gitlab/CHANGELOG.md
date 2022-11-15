# @backstage/plugin-events-backend-module-gitlab

## 0.1.0

### Minor Changes

- 63f7983398: Adds a new module `gitlab` to plugin-events-backend.

  The module adds a new event router `GitlabEventRouter`.

  The event router will re-publish events received at topic `gitlab`
  under a more specific topic depending on their `$.event_name` value
  (e.g., `gitlab.push`).

  Please find more information at
  https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-gitlab/README.md.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.1.0
  - @backstage/backend-plugin-api@0.1.4
