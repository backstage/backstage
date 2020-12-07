---
'@backstage/plugin-api-docs': minor
---

Stop exposing a custom router from the `api-docs` plugin. Instead, use the
widgets exported by the plugin to compose your custom entity pages.

Instead of displaying the API definitions directly in the API tab of the
component, it now contains tables linking to the API entities. This also adds
new widgets to display relationships (bot provides & consumes relationships)
between components and APIs.

See the changelog of `create-app` for a migration guide.
