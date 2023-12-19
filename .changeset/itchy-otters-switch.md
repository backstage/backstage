---
'@backstage/plugin-scaffolder': minor
'@backstage/plugin-scaffolder-react': minor
---

Added support for dealing with user provided secrets using a new field extension `ui:field: Secret`

The `@alpha` exports of `Stepper` now needs to be wrapped in a `SecretsContextProvider` for access to secrets.
