---
'@backstage/backend-dynamic-feature-service': patch
---

Dynamic frontend plugins are now picked up without a backend restart. When a frontend plugin package is added to, removed from or updated in the dynamic plugins root directory, the `/remotes` list and the served plugin assets are updated. Changes to dynamic backend plugin packages still need a restart, and the backend now logs a warning when it detects one. Entries in the root directory whose names start with `.` are now ignored, so plugins can be staged in a hidden directory and then renamed into place.

The `FrontendPluginProvider` interface has a new optional `frontendPluginsGeneration` property, which changes each time the set of frontend plugins is refreshed.
