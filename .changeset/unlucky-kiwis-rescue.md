---
'@backstage/core': minor
---

Introducing a new optional property within `app-config.yaml` called `auth.environment` to have configurable environment value for `auth.providers`

**Default Value:** 'development'

**Optional Values:** 'production' | 'development'

**Migration-steps:**

- To override the default value, one could simply introduce the new property `environment` within the `auth` section of the `config.yaml`
- re-run the build to reflect the changed configs
