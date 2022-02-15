---
'@backstage/plugin-jenkins-backend': patch
---

The `DefaultJenkinsInfoProvider.fromConfig` now requires an implementation of the `CatalogApi` rather than a `CatalogClient` instance.
