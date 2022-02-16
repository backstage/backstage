---
'@backstage/plugin-scaffolder-backend': minor
---

Remove the previously deprecated `scaffolder.provider` config for all providers.
This config is no longer used anywhere, and adopters should use [`integrations` config](https://backstage.io/docs/integrations) instead.
