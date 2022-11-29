---
'@backstage/cli': minor
---

Adds support for two new CLI options on the `repo build` and `package build` commands. Both options are only available to frontend components. Backend config continues to be supplied at runtime.

CLI options take precedent over any provided config.

The new options are meant to add greater support for running the same bundle in multiple environments, ex: test, stage and prod.
`--publicPath`: Frontend subroute to host the app on, can be relative or absolute.
`--backendUrl`: Backend url that the {backend.basePath}, e.g. /api, endpoint can be reached on. Can be relative or absolute.
