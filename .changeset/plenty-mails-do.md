---
'@backstage/plugin-api-docs': patch
---

Added `resolvers` prop to `AsyncApiDefinitionWidget`. This allows to override the default http/https resolvers, for example to add authentication to requests to internal schema registries.
