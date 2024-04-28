---
'@backstage/backend-plugin-api': minor
---

Adds a new core service called `InstanceMetadataService` that contains information about the current instance. For now, it has a single method `getInstalledFeatures()` that returns a list of plugins and modules installed on the instance.
