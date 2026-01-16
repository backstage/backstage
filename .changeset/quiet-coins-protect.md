---
'@backstage/frontend-app-api': minor
---

BREAKING: The ability for plugins to override APIs has been restricted to only allow overrides of APIs within the same plugin. For example, a plugin can no longer override any of the core APIs provided by the `app` plugin, this must be done with an `app` module instead.
