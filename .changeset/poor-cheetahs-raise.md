---
'@backstage/plugin-catalog-backend-module-github': patch
---

Adds support for `repository` events.

The provider adds a subscription to the topic `github.repository`.

Hereby, it supports events of type `repository` with actions

- `archived`
- `deleted`
- `edited`
- `renamed`
- `transferred`
- `unarchived`

Actions skipped as they don't require entity changes:

- `created`
- `privatized`
- `publicized`

If the config option `validateLocationsExist` is enabled, an API request
is necessary and will be executed.
This affects the actions `renamed`, `transferred`, and `unarchive`
of event type `repository`.

Catalog entities related to the `GithubEntityProvider` instance will be adjusted
according to action and its meaning for them.
