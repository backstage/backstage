---
'@backstage/plugin-rollbar-backend': patch
'@backstage/plugin-scaffolder-backend': minor
---

Fix some `spleling`.

The `scaffolder-backend` has a configuration schema change that may be breaking
in rare circumstances. Due to a typo in the schema, the
`scaffolder.github.visibility`, `scaffolder.gitlab.visibility`, and
`scaffolder.bitbucket.visibility` did not get proper validation that the value
is one of the supported strings (`public`, `internal` (not available for
Bitbucket), and `private`). If you had a value that was not one of these three,
you may have to adjust your config.
