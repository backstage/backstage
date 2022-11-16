# @backstage/plugin-events-backend-module-github

## 0.1.0

### Minor Changes

- b3a4edb885: Adds a new module `github` to plugin-events-backend.

  The module adds a new event router `GithubEventRouter`.

  The event router will re-publish events received at topic `github`
  under a more specific topic depending on their `x-github-event` value
  (e.g., `github.push`).

  Please find more information at
  https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-github/README.md.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.1.0
  - @backstage/backend-plugin-api@0.1.4
