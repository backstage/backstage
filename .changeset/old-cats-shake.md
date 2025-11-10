---
'@backstage/backend-defaults': minor
'@backstage/backend-plugin-api': minor
---

Adds a new experimental `RootSystemMetadataService` for tracking the collection of Backstage instances that may be deployed at any one time. It currently offers a single API, `getInstalledPlugins` that returns a list of installed plugins based on config you have set up in `discovery.endpoints` as well as the plugins installed on the instance you're calling the API with. It does not handle wildcard values or fallback values. The intention is for this plugin to provide plugin authors with a simple interface to fetch a trustworthy list of all installed plugins.
